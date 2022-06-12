import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  validateSync
} from 'class-validator';

export type HttpMethod =
  'GET' |
  'HEAD' |
  'POST' |
  'PUT' |
  'DELETE' |
  'OPTIONS' |
  'TRACE' |
  'PATCH';

export interface IRule {
  disabled: boolean;
  interceptRequest: boolean;
  interceptResponse: boolean;
  name?: string;
  routeTo?: string;
  skipApi: boolean;
  method: HttpMethod | 'ALL';
  body: any;
  baseUrl?: string;
  path: string;
  statusCode?: number;
  type?: string;
}

export interface BaseRule extends Partial<IRule> {
  baseUrl: string;
}

export class Rule {
  @IsBoolean()
  disabled?: boolean;

  @IsBoolean()
  interceptRequest: boolean;

  @IsBoolean()
  interceptResponse: boolean;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  routeTo?: string;

  @IsBoolean()
  skipApi: boolean;

  @IsString()
  method: HttpMethod | 'ALL';

  @IsOptional()
  body: any;

  @IsString()
  @IsNotEmpty()
  baseUrl: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsOptional()
  statusCode?: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  constructor(rule: Partial<IRule>) {
    this.disabled = rule.disabled ?? false;
    this.interceptRequest = rule.interceptRequest ?? false;
    this.interceptResponse = rule.interceptResponse ?? false;
    this.name = rule.name;
    this.routeTo = rule.routeTo;
    this.skipApi = rule.skipApi ?? false;
    this.method = rule.method ?? 'ALL';
    this.body = rule.body ?? {};
    this.baseUrl = rule.baseUrl ?? '';
    this.path = rule.path ?? '';
    this.statusCode = rule.statusCode;
    this.type = rule.type ?? 'rest';
  }

  get errors() {
    return validateSync(this);
  }
}