---
sidebar_position: 3
---

# Custom Rule Types
Custom rule types allow you to define how rules are matched and handled. A rule type is made up of the following:

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| `type` | Rule type used to match rules | `string` | `yes` | |
| `createRule` | Create rule object used for the handler | `(rule: Partial<Rule<T>>) => Rule<T>` | `yes` | |
| `isMatch` | Used to determine if request matches a rule | `(request: HijackerRequest, rule: Rule<T>) => boolean` | `yes` | |
| `handler` | Request handler for rule type | `(request: Request<T>, baseRule: Partial<Rule<T>>, context: HijackerContext) => Promise<HijackerResponse>` | `yes` | |


## Type
The rule type is what is what determines if the custom rule type will be used for matching a rule. Hijacker will use a rule's `type` property in order to determine which Rule Type will be used to check for a match and then the matched rule's `type` will be used to determine which `handler` is used for the request.

## createRule
The `createRule` function takes a partial rule from the config and returns a rule. This should be used to set defaults for fields that have them.

## isMatch
This function takes a request and a rule and determines if that rule matches the request. Should return `true` if there is a match and `false` otherwise.

## handler
The `handler` tells hijacker how a request should be handled. This includes proxying to the external api if the rule type requires.