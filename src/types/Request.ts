import express from 'express';

import { HttpMethod, Rule } from '../rules/Rule.js';

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

export interface Request {
  originalReq: HijackerRequest;
  originalRes?: express.Response;
  matchingRule?: Rule;
}

