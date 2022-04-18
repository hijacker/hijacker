export enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH',
  ALL = 'ALL'
}

export class Rule {
  disabled: boolean;
  interceptRequest: boolean;
  interceptResponse: boolean;
  name?: string;
  routeTo?: string;
  skipApi: boolean;
  method: HttpMethod;
  path: string;
  statusCode?: number;
  type?: string;

  constructor() {
    this.disabled = false;
    this.interceptRequest = false;
    this.interceptResponse = false;
    this.skipApi = false;
    this.method = HttpMethod.ALL;
    this.path = '';
    this.type = 'http';
  }
}