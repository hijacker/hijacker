# Hijacker
[![npm](https://img.shields.io/npm/v/@hijacker/core.svg)](https://www.npmjs.com/package/@hijacker/core)
[![Build Status](https://github.com/travis-w/hijacker/actions/workflows/workflow.yml/badge.svg)](https://github.com/travis-w/hijacker/actions/workflows/workflow.yml)
[![Coverage Status](https://coveralls.io/repos/github/travis-w/hijacker/badge.svg?branch=main)](https://coveralls.io/github/travis-w/hijacker?branch=main)

Hijacker is a develoment too meant to proxy to an existing API while being able to mock and modify specific requests via rules.

- [Get Started](#get-started)
  - [Install](#install)
  - [Create Config](#create-config)
  - [Run](#run)
- [Config](#config)
  - [Config](#config-1)
  - [Rule](#rule)
  - [Base Rule](#base-rule)
  - [Rule Types](#rule-types)
  - [Logger](#logger)
- [Extending Hijacker](#extending-hijacker)
  - [Plugins](#plugins)
  - [Custom Rule Types](#custom-rule-types)
  - [Hooks](#hooks)

## Get Started

### Install 

#### Locally
```shell
npm i -D @hijacker/core
```

#### Globally
```shell
npm i -g @hijacker/core
```

### Create Config
Create config file named `hijacker.config.js` with the following:
```javascript
module.exports = {
  port: 3000,
  baseRule: {
    baseUrl: '<YOUR_API_URL>'
  },
  rules: []
}
```
View [Config](#config) for more information.

### Run
Add a `hijacker` script to your `package.json` file:
`"hijacker": "hijacker"`.

Then run the following command in the directory with your config file:
```shell
npm run hijacker
```
Your hijacker instance should now be running at `http://localhost:3000` with the interface available at `http://localhost:3000/hijacker`.

## Config

### Config
| Property | Descripton | Type | Required | Default |
| -------- | ---------- | ---- | -------- | ------- |
| `port` | Port that you want the hijacker instance to run on | `number` | `yes` |
| `baseRule` | Base rule that other rules will inhert from. See [Base Rule](#base-rule) | `Partial<Rule>` | `yes` | |
| `rules` | Array of hijacker rules. See [Rule](#rule) | `Partial<Rule>[]` | `yes` | |
| `logger` | Logger configuration options. See [Logger](#logger) | `LoggerOptions` | `no` | |

### Rule
A tells hijacker how to handle certain requests. If no matching rule is found, hijacker will proxy the request to the API server.

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `name` | Rule name. Used for display purposes only | `string` | `no` | |
| `disabled` | If rule is disabled it can't be matched | `boolean` | `no` | `false` |
| `type` | Rule type. Used to determine which RuleType to use for matching and handling the request | `string` | `rest` |
| `baseUrl` | Base URL for API you want to point hijacker at for specific rule | `string` | `no` | |

### Base Rule
The base rule allows you set default values for the  

### Rule Types
By default hijacker includes Rest and a GraphQL rule types. Each rule type can have additional properties that build upon the base rule properties. Each rule will be merged with the Base Rule and use it's values unless overridden in the rule.

The base rule has the same values as [Rules](#rule). The only difference is that `baseUrl` is required so that requests that have no matching rule will be able to be proxied.

#### Rest Rule
The rest rule type is meant for REST APIs, and will be used for rule's where `type` is set to `rest`. The rest rule type has the same properties as the [Rule](#rule), as well as the following:

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `skipApi` | | `boolean` | `no` | `false` |
| `method` | HTTP method of the request to match on. | `GET` \| `HEAD` \| `POST` \| `PUT` \| `DELETE` \| `OPTIONS` \| `TRACE` \| `PATCH` \| `ALL` | `no` | `ALL` |
| `body` | Response body to send back when a rule matches | `any` | `no` | `undefined` |
| `path` | URL path of request to match on. | `string` | `yes` | |
| `statusCode` | Status code you would like hijacker return for a request | `number` | `no` | |
| `routeTo` | Path to redirect request to at the API url | `string` | `no` | |

#### GraphQL Rule
The GraphQL rule type expands on the Rest Rule but adds matching that works for GraphQL queries. Right now the GraphQL rule type only matches on the operation name. 

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `operationName` | Operation to match in graphql query | `string` | `yes` | |

__Example__:
```graphql
query TestQuery {
  posts {
    name
    id
  }
}
```
For the above query, `TestQuery` is the `operationName` that should be used to match query in a rule.

### Logger
Settings for built in logger. This may eventually get changed to accepting a custom logger.
| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `level` | Max log level that you wan't logged to the console. | `SILLY` \| `DEBUG` \| `HTTP` \| `INFO` \| `WARN` \| `ERROR` \| `NONE` | `no` | `INFO` |

## Extending Hijacker
Hijacker was made with extensibility in mind. There are a two ways Hijacker can be extended: custom rule types and hooks.

### Plugins
Plugins are how hooks and rule types are packaged up to be added to a config for a hijacker user to use.

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `name` | Name of plugin | string | `yes` | |
| `initPlugin` | Function called to initialize plugin and pass HijackerContext | `(context: HijackerContext) => void` | `no` | |
| `hooks` | Array of hook names that the plugin allows to be hooked into | `string[]` | `no` | |
| `handlers` | List of hook handlers for plugin | `Record<string, function>` | `no` | |
| `ruleTypes` | Array of [custom rule types](#custom-rule-types) | `RuleType[]` | `no` | |

### Custom Rule Types
It is possible to create custom rule types, that allow for request matching and handling. You can view [RestRule](src/rules/RestRule.ts) and [GraphqlRule](src/rules/GraphqlRule.ts) for examples.

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `type` | Rule type used to match rules | `string` | `yes` | |
| `createRule` | Create rule object used for the handler | `(rule: Partial<Rule>) => Rule` | `yes` | |
| `isMatch` | Used to determine if request matches a rule | `(request: HttpRequest, rule: Rule) => boolean` | `yes` | |
| `handler` | Request handler for rule type | `(request: HijackerRequest, baseRule: Partial<Rule>, context: HijackerContext) => Promise<HttpResponse>` | `yes` | |

### Hooks
Hooks allow plugins to listen and modify objects at specific points in the request lifecycle. Hook handlers are passed an object that they can modify and return an object of the same shape. Right now Hijacker has hooks for the following events:

| Hook Name | Type | Description | Synchronous |
| --------- | ---- | ----------- | ----------- |
| `HIJACKER_START` | `Config` | Executed when hijacker starts up and allows modifying the hijacker config | `yes` |
| `HIJACKER_REQUEST` | `HttpRequest` |  Begining of request. Called before rule matched | `no` |
| `HIJACKER_RESPONSE` | `HttpResponse` | Called after request handler, before response returned to client | `no` | 

Plugins are able to add additional hooks using the HookManager which allow other plugins to modify their functionality.