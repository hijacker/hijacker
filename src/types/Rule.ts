export enum HttpMethod {
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH,
  ALL
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

  constructor() {
    this.disabled = false;
    this.interceptRequest = false;
    this.interceptResponse = false;
    this.skipApi = false;
    this.method = HttpMethod.ALL;
    this.path = '';
  }
}