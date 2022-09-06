import express from 'express';

import { HttpMethod, Rule } from '../rules/index.js';

// Request to hijacker from client
export interface HijackerRequest {
  path: string;
  headers: Record<string, string>;
  body: any;
  method: HttpMethod;
}

export interface HijackerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}

export interface Request<T = any> {
  originalReq: HijackerRequest;
  originalRes?: express.Response;
  matchingRule: Rule<T>;
}

