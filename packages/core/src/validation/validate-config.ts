import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import keywords from 'ajv-keywords';

import type { Config } from '../hijacker.js';

export class ValidationError extends Error {
  errors: ErrorObject[];

  constructor(errors?: ErrorObject[]) {
    super('Validation Error');

    this.errors = errors ?? [];
  }
}

const CONFIG_SCHEMA: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    port: {
      type: 'number',
      nullable: false,
    },
    baseRule: {
      type: 'object',
      additionalProperties: true,
      nullable: false,
    },
    rules: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        additionalProperties: true
      },
      nullable: false,
    },
    plugins: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
        required: ['name']
      },
      nullable: true,
    },
    logger: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          enum: ['SILLY', 'DEBUG', 'HTTP', 'INFO', 'WARN', 'ERROR', 'NONE'],
          nullable: true
        }
      },
      required: [],
      nullable: true,
    }
  },
  required: ['port'],
  additionalProperties: true
};

export const validateConfig = (config: unknown): Config => {
  const ajv = new Ajv({ allErrors: true });
  keywords(ajv);

  const validate = ajv.compile(CONFIG_SCHEMA);

  const valid = validate(config);

  if (!valid) {
    throw new ValidationError(validate.errors ?? []);
  }

  return config;
};