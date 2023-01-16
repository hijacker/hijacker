import type { Rule, Config } from '@hijacker/core';
import type { Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

import { HistoryItem } from './History.js';


export interface ClientToServerEvents {
  ADD_RULES: (rule: Partial<Rule<any>>[]) => void;
  UPDATE_RULES: (rule: Partial<Rule<any>>[]) => void;
  UPDATE_BASE_RULE: (rule: Partial<Rule<any>>) => void;
  DELETE_RULES: (ids: string[]) => void;
}

export interface ServerToClientEvents {
  SETTINGS: (config: Config) => void;
  RULES_UPDATED: (rules: Partial<Rule<any>>[]) => void;
  BASE_RULE_UPDATED: (rule: Partial<Rule<any>>) => void;
  HISTORY_EVENT: (historyItem: HistoryItem) => void;
}

export type HijackerSocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;
export type HijackerSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;