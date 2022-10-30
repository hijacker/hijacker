import { Server } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import bodyParser from 'body-parser';
import express from 'express';
import xmlParser from 'express-xml-bodyparser';

import type { HttpMethod } from './rules/index.js';
import { RuleManager, HookManager, EventManager, PluginManager } from './managers/index.js';
import type { Config, HijackerContext, HijackerRequest, HijackerResponse, Request } from './types/index.js';
import { filterResponseHeaders, Logger } from './utils/index.js';

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
      hookManager,
      ruleManager,
      logger
    } = this.context;

    this.pluginManager = new PluginManager({
      context: this.context,
      plugins: startConfig.plugins
    });

    const config = hookManager.executeSyncHook<Config>('HIJACKER_START', startConfig);

    logger.level = config.logger?.level ?? 'INFO';

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
          
          logger.log('INFO', `[${req.method}] ${req.originalUrl}`);

          // Generate first HijackerRequest/Lifecycle OBJ and match rule
          const originalReq = await hookManager.executeHook<HijackerRequest>('HIJACKER_REQUEST', {
            path: req.originalUrl,
            headers: filterResponseHeaders(req.headers as Record<string, string>),
            body: req.body,
            method: req.method as HttpMethod
          });

          const matchingRule = ruleManager.match(originalReq);
          
          const request: Request = {
            originalReq,
            matchingRule
          };

          // Call ruletype handler
          const newRes = await hookManager.executeHook<HijackerResponse>(
            'HIJACKER_RESPONSE',
            await ruleManager.handler(request.matchingRule.type ?? 'rest', request, this.context)
          );

          // Send response to server (break out into function that takes response)
          res.set(filterResponseHeaders(newRes.headers));
  
          return res.status(newRes.statusCode).send(newRes.body);
        } catch (e: unknown) {
          const body: Record<string, string | undefined> = {
            message: 'There was an error with the hijacker request'
          };

          if (e instanceof Error) {
            body.error = e.message;
            body.stack = e.stack;
          }
          
          return res.status(500).send(body);
        }
      });
    
    this.server.listen(config.port, () => {
      this.emit('started', config.port);
    });
  }
  
  private createContext(server: Server): HijackerContext {
    const logger = new Logger();

    const eventManager = new EventManager({
      server,
      logger
    });

    const hookManager = new HookManager({
      logger
    });

    const ruleManager = new RuleManager({
      logger,
      eventManager
    });

    return {
      eventManager,
      hookManager,
      ruleManager,
      logger
    };
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.on(eventName, cb);
  }

  once(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.once(eventName, cb);
  }

  off(eventName: string, cb: (...args: any[]) => void) {
    this.context.eventManager.off(eventName, cb);
  }

  emit(eventName: string, val: any) {
    this.context.eventManager.emit(eventName, val);
  }

  async close() {
    return new Promise<void>(async (done) => {
      this.server.close(() => {
        done();
      });
    });
  }
}

export const defineConfig = (config: Config) => config;
export * from './rules/index.js';
export * from './types/index.js';
export * from './utils/index.js';
export * from './managers/index.js';