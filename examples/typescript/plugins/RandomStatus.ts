import { HijackerResponse, Plugin } from '@hijacker/core';

const STATUS_CODES = [200, 400, 404, 202];

export class RandomStatusPlugin implements Plugin {
  name = 'RandomStatus';
  handlers = {
    'HIJACKER_RESPONSE': (response: HijackerResponse) => {
      return {
        ...response,
        statusCode: STATUS_CODES[Math.floor(Math.random()*STATUS_CODES.length)],
      }
    }
  };
}