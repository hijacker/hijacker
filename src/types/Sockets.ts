import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';

import { Rule } from '../rules/Rule';
import { Config } from './Config';

export interface ClientToServerEvents {
  ADD_RULES: (rule: Partial<Rule<any>>[]) => void;
  UPDATE_RULES: (rule: Partial<Rule<any>>[]) => void;
  UPDATE_BASE_RULE: (rule: Partial<Rule<any>>) => void;
  DELETE_RULES: (ids: string[]) => void;
}

export interface ServerToClientEvents {
  SETTINGS: (config: Config) => void;
  UPDATE_RULES: (rules: Partial<Rule<any>>[]) => void;
}

export type HijackerSocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;
export type HijackerSocketServer = Server<ClientToServerEvents, ServerToClientEvents>;