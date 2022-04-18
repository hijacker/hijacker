import express from 'express';
import { Rule } from './Rule';

export interface Request {
  originalReq: express.Request;
  originalRes: express.Response;
  matchingRule: Rule;
}

