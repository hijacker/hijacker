# @hijacker/eslint-config

## 1.0.0-beta.2

### Minor Changes

- cb43887: # @hijacker/core
  Adding guards to hooks. Makes it so that the result of hook handlers must pass validation. Otherwise an error is thrown.

  # @hijacker/eslint-config

  Changing import order to include all groups.

## 1.0.0-beta.1

### Major Changes

- 55bc52d: Convert to zod types

  Switch to zod and refactor all types to using it. Breaking change because some types are renamed as well as moving types around.

  Types renamed:
  `HijackerRequest` -> `HttpRequest`
  `HijackerResponse` -> `HttpResponse`
  `Request` -> `HijackerRequest`

## 1.0.0-beta.0

### Major Changes

- 519134e: Create `@hijacker/eslint-config` and add linting to all packages

### Patch Changes

- 519134e: Various package cleanup + Start README fixes

  Fix bug in `@hijacker/plugin-frontend` where rules werent updating on frontend.

  Change `deleteRule` to `deleteRules` in `@hijacker/core`
