import path from 'path';
import { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import xmlParser from 'express-xml-bodyparser';

import {
  EventManager
} from './utils';
import { Config } from '../types/Config';
import { RuleManager } from './rules/RuleManager';
import { Request } from '../types/Request';
import { HttpMethod } from './rules/Rule';

export class Hijacker {
  app: express.Application;
  server: Server;
  ruleManager: RuleManager;
  eventManager: EventManager;

  constructor(config: Config) {
    this.app = express();
    this.server = new Server(this.app);
    this.eventManager = new EventManager();
    this.ruleManager = new RuleManager({
      ruleTypes: [],
      rules: config.rules ?? [],
      baseRule: config.baseRule ?? {}
    });

    this.app
      .get('/favicon.ico', (req, res) => res.sendStatus(204))
      .use('/hijacker', express.static(path.join(__dirname, './frontend')))
      .use(bodyParser.json())
      .use(xmlParser())
      .use('*', async (req, res) => {
        // Set Headers Needed (TODO: Grab allow-headers from config)
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '');

        // Generate first HijackerRequest/Lifecycle OBJ and match rule
        const request: Request = {
          originalReq: {
            path: req.originalUrl,
            headers: req.headers as Record<string, string>,
            body: req.body,
            method: req.method as HttpMethod
          }
        };

        request.matchingRule = this.ruleManager.match(request.originalReq);

        // Call ruletype handler
        const newRes = await this.ruleManager.handler(request.matchingRule?.type ?? 'rest', request);

        // Send response to server (break out into function that takes response)
        res.set(newRes.headers);
        res.status(newRes.statusCode).send(newRes.body);
      });
    
    this.server.listen(config.port, () => {
      this.emit('started', config.port);
    });
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.on(eventName, cb);
  }

  once(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.once(eventName, cb);
  }

  off(eventName: string, cb: (...args: any[]) => void) {
    this.eventManager.off(eventName, cb);
  }

  emit(eventName: string, val: any) {
    this.eventManager.emit(eventName, val);
  }

  close() {
    this.server.close();
  }
}