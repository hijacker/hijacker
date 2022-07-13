import { Server } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import bodyParser from 'body-parser';
import express from 'express';
import xmlParser from 'express-xml-bodyparser';

import { HttpMethod, IRule } from './rules/Rule.js';
import { RuleManager } from './rules/RuleManager.js';
import { Config } from './types/Config.js';
import { Request } from './types/Request.js';
import {
  EventManager, filterResponseHeaders
} from './utils/index.js';

export class Hijacker {
  app: express.Application;
  server: Server;
  ruleManager: RuleManager;
  eventManager: EventManager;

  constructor(config: Config) {
    this.app = express();
    this.server = new Server(this.app);
    this.eventManager = new EventManager(this.server);
    this.ruleManager = new RuleManager({
      ruleTypes: [],
      rules: config.rules ?? [],
      baseRule: config.baseRule
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
          const request: Request = {
            originalReq: {
              path: req.originalUrl,
              headers: filterResponseHeaders(req.headers as Record<string, string>),
              body: req.body,
              method: req.method as HttpMethod
            }
          };
  
          request.matchingRule = this.ruleManager.match(request.originalReq);
  
          // Call ruletype handler
          const newRes = await this.ruleManager.handler(request.matchingRule?.type ?? 'rest', request);
  
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
      this.eventManager.on('connection', (socket) => {
        socket.emit('SETTINGS', {
          rules: this.ruleManager.rules
        });

        socket.on('UPDATE_RULE', (rule: Partial<IRule>) => {
          this.ruleManager.updateRule(rule);
          this.eventManager.emit('UPDATE_RULES', this.ruleManager.rules);
        });

        socket.on('ADD_RULE', (rule: Partial<IRule>) => {
          this.ruleManager.addRule(rule);
          this.eventManager.emit('UPDATE_RULES', this.ruleManager.rules);
        });
      }, 'socket');

      this.emit('started', config.port);
    });
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.on(eventName, cb, 'event-manager');
  }

  once(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.once(eventName, cb, 'event-manager');
  }

  off(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.off(eventName, cb, 'event-manager');
  }

  emit(eventName: string, val: any) {
    this.eventManager.emit(eventName, val, 'event-manager');
  }

  async close() {
    return new Promise<void>(async (done) => {
      this.eventManager.close();
      this.server.close(() => {
        done();
      });
    });
  }
}