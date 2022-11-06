import { Server } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { HijackerContext, Plugin, Rule } from '@hijacker/core';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

import { HijackerSocketServer } from './types/index.js';

interface FrontendPluginOptions {
  name?: string;
  port: number;
}

export class FrontendPlugin implements Plugin {
  name: string;
  
  private app: express.Application;
  private server: Server;
  private port: number;
  private io: HijackerSocketServer;

  constructor({ name, port }: FrontendPluginOptions) {
    this.name = name ?? 'frontend';
    
    this.port = port;
    this.app = express();
    this.server = new Server(this.app);
    this.io = new SocketServer(this.server, {
      maxHttpBufferSize: 1e8,
      cors: {
        origin: true
      }
    });
  }

  initPlugin({ logger, ruleManager, eventManager }: HijackerContext) {
    this.app
      .use('/assets', express.static(join(dirname(fileURLToPath(import.meta.url)), './frontend/assets'), { fallthrough: false,  }))
      .get('*', (_, res) => {
        res.sendFile(join(dirname(fileURLToPath(import.meta.url)), './frontend', 'index.html'));
      });

    this.io.on('connection', (socket) => {
      socket.emit('SETTINGS', {
        port: 123,
        baseRule: ruleManager.baseRule,
        rules: ruleManager.rules
      });

      socket.on('UPDATE_BASE_RULE', (rule: Partial<Rule<any>>) => {
        ruleManager.baseRule = rule;
      });

      socket.on('UPDATE_RULES', (rules: Partial<Rule>[]) => {
        rules.forEach((rule) => ruleManager.updateRule(rule));
      });

      socket.on('ADD_RULES', (rules: Partial<Rule>[]) => {
        ruleManager.addRules(rules);
      });

      socket.on('DELETE_RULES', (ids: string[]) => {
        ruleManager.deleteRules(ids);
      });
    });

    eventManager.on('RULES_UPDATED', (rules) => {
      this.io.emit('UPDATE_RULES', rules);
    });
    
    this.server.listen(this.port, () => {
      logger.log('INFO', `[Frontend] Frontend listening on port: ${this.port}`);
    });
  }
}