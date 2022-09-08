---
sidebar_position: 3
---

# Rules
Rules are used to tell hijacker what do do with a request.

## Base Rule
The base rule is the default values that the rules in your config will inherit. Values in the base rule will be used if they are not provided in the matched rule.

## Rule
A tells hijacker how to handle certain requests. If no matching rule is found, hijacker will use the base rule. All rules can have the following properties:

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `type` | Rule type. Used to determine which RuleType to use for matching and handling the request | `string` | `no` | `rest` |
| `disabled` | If rule is disabled it can't be matched | `boolean` | `no` | `false` |
| `name` | Rule name. Used for display purposes only | `string` | `no` | |
| `baseUrl` | Base URL for API you want to point hijacker at for specific rule | `string` | `no` | |

## Rest Rule
The default (and only included) rule type in hijacker is for `REST` APIs. The following properties are used for the rest rule type:

### Properties
| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `path` | URL path of request to match on. | `string` | `yes` | |
| `method` | HTTP method of the request to match on. | `GET` \| `HEAD` \| `POST` \| `PUT` \| `DELETE` \| `OPTIONS` \| `TRACE` \| `PATCH` \| `ALL` | `no` | `ALL` |
| `body` | Response body to send back when a rule matches | `any` | `no` | `undefined` |
| `statusCode` | Status code you would like hijacker return for a request | `number` | `no` | |
| `skipApi` | If set to `true` the call to the external API will not be made | `boolean` | `no` | `false` |
| `routeTo` | Path to redirect request to at the API url | `string` | `no` | |

### Matching
The rest rule type will be used when the `type` of a rule is set to `rest` AND the request matches both the `path` and `method` of the rule.