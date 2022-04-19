import path from 'path';
import { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import xmlParser from 'express-xml-bodyparser';

import {
  EventManager
} from './utils';
import { Config } from '../types/Config';
import { RuleMatcher } from './rules/RuleMatcher';

export class Hijacker {
  app: express.Application;
  server: Server;
  ruleMatcher: RuleMatcher;
  eventManager: EventManager;

  constructor(config: Config) {
    this.app = express();
    this.server = new Server(this.app);
    this.eventManager = new EventManager();
    this.ruleMatcher = new RuleMatcher([/* TODO: Load plugins to add matchers */]);

    this.app
      .get('/favicon.ico', (req, res) => res.sendStatus(204))
      .use('/hijacker', express.static(path.join(__dirname, './frontend')))
      .use(bodyParser.json())
      .use(xmlParser())
      .use('*', (req, res) => {
        // Set Headers Needed (TODO: Grab allow-headers from config)
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '');

        // Generate first HijackerRequest/Lifecycle OBJ and match rule
        console.log(this.ruleMatcher.match(req, config.rules));

        // Call ruletype handler

        // Send response to server 
        res.json({ test: 'test' });
      });
    
    this.server.listen(config.port, () => {
      this.eventManager.emit('started', config.port);
    });
  }

  on(eventName: string, cb: () => void) {
    this.eventManager.on(eventName, cb);
  }

  once(eventName: string, cb: () => void) {
    this.eventManager.once(eventName, cb);
  }

  off(eventName: string, cb: () => void) {
    this.eventManager.off(eventName, cb);
  }

  emit(eventName: string, val: any) {
    this.eventManager.emit(eventName, val);
  }

  close () {
    this.server.close();
  }
}