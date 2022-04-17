import path from 'path';

import { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import xmlParser from 'express-xml-bodyparser';

import {
  applyMixins,
  EventMixin
} from './mixins';
import { Config } from '../types/Config';

export class Hijacker {
  app: express.Application;
  server: Server;

  constructor(config: Config) {
    this.app = express();
    this.server = new Server(this.app);
    this._initEvents();

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

        // Call ruletype handler

        // Send response to server 
        res.json({ test: 'test' });
      });
    
    this.server.listen(config.port, () => {
      this._emit('started', config.port);
    });
  }

  close () {
    this.server.close()
  }
}

export interface Hijacker extends EventMixin {}

applyMixins(Hijacker, [EventMixin]);
