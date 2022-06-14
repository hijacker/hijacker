import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  validateSync,
  IsUUID
} from 'class-validator';
import { v4 as uuid } from 'uuid';

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
  id?: string;
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
  @IsUUID()
  id: string;

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
    this.id = uuid();
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

  update(rule: Partial<IRule>) {
    this.disabled = rule.disabled ?? this.disabled;
    this.interceptRequest = rule.interceptRequest ?? this.interceptRequest;
    this.interceptResponse = rule.interceptResponse ?? this.interceptResponse;
    this.name = rule.name ?? this.name;
    this.routeTo = rule.routeTo ?? this.routeTo;
    this.skipApi = rule.skipApi ?? this.skipApi;
    this.method = rule.method ?? this.method;
    this.body = rule.body ?? this.body;
    this.baseUrl = rule.baseUrl ?? this.baseUrl;
    this.path = rule.path ?? this.path;
    this.statusCode = rule.statusCode ?? this.statusCode;
    this.type = rule.type ?? this.type;
  }

  get errors() {
    return validateSync(this);
  }
}