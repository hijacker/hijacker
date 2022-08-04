import { Server } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import bodyParser from 'body-parser';
import express from 'express';
import xmlParser from 'express-xml-bodyparser';

import { HttpMethod, IRule } from './rules/Rule.js';
import { RuleManager } from './rules/RuleManager.js';
import { Config } from './types/Config.js';
import { HijackerContext } from './types/index.js';
import { Request, HijackerRequest } from './types/Request.js';
import {
  EventManager, filterResponseHeaders, HookManager
} from './utils/index.js';
import { PluginManager } from './utils/PluginManager.js';

export class Hijacker {
  app: express.Application;
  server: Server;
  pluginManager: PluginManager;
  context: HijackerContext;

  constructor(startConfig: Config) {
    this.app = express();
    this.server = new Server(this.app);
    this.context = this.createContext(this.server);

    const { 
      eventManager,
      hookManager,
      ruleManager
    } = this.context;

    this.pluginManager = new PluginManager({
      context: this.context,
      plugins: startConfig.plugins
    });

    const config = hookManager.executeSyncHook<Config>('HIJACKER_START', startConfig);

    ruleManager.init({
      baseRule: config.baseRule,
      rules: config.rules
    });

    this.app
      .get('/favicon.ico', (req, res) => res.sendStatus(204))
      .use('/hijacker/static', express.static(join(dirname(fileURLToPath(import.meta.url)), './frontend/static'), { fallthrough: false,  }))
      .get(['/hijacker/*', '/hijacker'], (req, res) => {
        res.sendFile(join(dirname(fileURLToPath(import.meta.url)), './frontend', 'index.html'));
      })
      .use(bodyParser.json())
      .use(xmlParser())
      .use('*', async (req, res) => {
        try {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Headers', '');
  
          // Generate first HijackerRequest/Lifecycle OBJ and match rule
          const originalReq = await hookManager.executeHook<HijackerRequest>('HIJACKER_REQUEST', {
            path: req.originalUrl,
            headers: filterResponseHeaders(req.headers as Record<string, string>),
            body: req.body,
            method: req.method as HttpMethod
          });

          const request: Request = {
            originalReq
          };
  
          request.matchingRule = ruleManager.match(request.originalReq);
  
          // Call ruletype handler
          const newRes = await ruleManager.handler(request.matchingRule?.type ?? 'rest', request, this.context);
  
          // Send response to server (break out into function that takes response)
          res.set(filterResponseHeaders(newRes.headers));
  
          res.status(newRes.statusCode).send(newRes.body);
        } catch (e: unknown) {
          if (e instanceof Error) {
            res.status(500).json({
              message: 'There was an error with the hijacker request',
              error: e.message,
              stack: e.stack
            });
          } else {
            res.status(500).json({
              message: 'There was an error with the hijacker request'
            });
          }
        }
      });
    
    this.server.listen(config.port, () => {
      // Set up sockets
      eventManager.on('connection', (socket) => {
        socket.emit('SETTINGS', {
          rules: ruleManager.rules
        });

        socket.on('UPDATE_RULES', (rules: Partial<IRule>[]) => {
          rules.forEach((rule) => ruleManager.updateRule(rule));
          eventManager.emit('UPDATE_RULES', ruleManager.rules);
        });

        socket.on('ADD_RULES', (rules: Partial<IRule>[]) => {
          rules.forEach((rule) => ruleManager.addRule(rule));
          eventManager.emit('UPDATE_RULES', ruleManager.rules);
        });

        socket.on('DELETE_RULES', (ids: string[]) => {
          ids.forEach((id) => ruleManager.deleteRule(id));
          eventManager.emit('UPDATE_RULES', ruleManager.rules);
        });
      }, 'socket');

      this.emit('started', config.port);
    });
  }
  
  private createContext(server: Server): HijackerContext {
    return {
      eventManager: new EventManager(server),
      hookManager: new HookManager(),
      ruleManager: new RuleManager()
    };
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.on(eventName, cb, 'event-manager');
  }

  once(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.once(eventName, cb, 'event-manager');
  }

  off(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.off(eventName, cb, 'event-manager');
  }

  emit(eventName: string, val: any) {
    this.context.eventManager.emit(eventName, val, 'event-manager');
  }

  async close() {
    return new Promise<void>(async (done) => {
      this.context.eventManager.close();

      this.server.close(() => {
        done();
      });
    });
  }
}