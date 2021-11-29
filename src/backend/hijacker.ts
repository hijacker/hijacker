import path from 'path';

import { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import xmlParser from 'express-xml-bodyparser';

import {
  applyMixins,
  EventMixin
} from './mixins';

interface HijackerConfig {
  port: number;
  rules: any[];
};

export class Hijacker {
  app: express.Application;
  server: Server;

  constructor(config: HijackerConfig) {
    this.app = express();
    this.server = new Server(this.app);
    this._initEvents();

    this.app
      .get('/favicon.ico', (req, res) => res.sendStatus(204))
      .use('/hijacker', express.static(path.join(__dirname, './frontend')))
      .use(bodyParser.json())
      .use(xmlParser());
    
    this.server.listen(config.port, () => {
      this._emit('started', config.port);
    });
  }
}

export interface Hijacker extends EventMixin {}

applyMixins(Hijacker, [EventMixin]);
