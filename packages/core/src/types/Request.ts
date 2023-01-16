import { Response } from 'express';

import { HttpMethod, Rule } from '../rules/index.js';

// Request to hijacker from client
export interface HijackerRequest {
  requestId: string;
  path: string;
  headers: Record<string, string>;
  body: any;
  method: HttpMethod;
}

export interface HijackerResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}

export interface Request<T = any> {
  originalReq: HijackerRequest;
  originalRes?: Response;
  matchingRule: Rule<T>;
}

