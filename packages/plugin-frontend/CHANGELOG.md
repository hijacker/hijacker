# @hijacker/plugin-frontend

## 1.0.0-beta.7

### Major Changes

- 55bc52d: Convert to zod types

  Switch to zod and refactor all types to using it. Breaking change because some types are renamed as well as moving types around.

  Types renamed:
  `HijackerRequest` -> `HttpRequest`
  `HijackerResponse` -> `HttpResponse`
  `Request` -> `HijackerRequest`

### Patch Changes

- Updated dependencies [55bc52d]
  - @hijacker/core@2.0.0-beta.11

## 1.0.0-beta.6

### Minor Changes

- 7cd3364: Add history page for `@hijacker/plugin-frontend` so traffic through hijacker can be inspected.

  Add `requestId` and `timestamp` fields to `HijackerRequest` and `HijackerResponse` in `@hijacker/core`.

### Patch Changes

- Updated dependencies [7cd3364]
  - @hijacker/core@2.0.0-beta.10

## 1.0.0-beta.5

### Patch Changes

- Updated dependencies [779a527]
  - @hijacker/core@2.0.0-beta.9

## 1.0.0-beta.4

### Patch Changes

- Updated dependencies [c3912b0]
  - @hijacker/core@2.0.0-beta.8

## 1.0.0-beta.3

### Patch Changes

- Updated dependencies [ee641a0]
  - @hijacker/core@2.0.0-beta.7

## 1.0.0-beta.2

### Minor Changes

- 519134e: Various package cleanup + Start README fixes

  Fix bug in `@hijacker/plugin-frontend` where rules werent updating on frontend.

  Change `deleteRule` to `deleteRules` in `@hijacker/core`

- 519134e: Clean up `@hijacker/plugin-frontend` frontend interface and add a filter search.

### Patch Changes

- 519134e: Create `@hijacker/eslint-config` and add linting to all packages
- Updated dependencies [519134e]
- Updated dependencies [519134e]
- Updated dependencies [519134e]
  - @hijacker/core@2.0.0-beta.6

## 1.0.0-beta.1

### Patch Changes

- 9abbc3d: Fix deploy for frontend

## 1.0.0-beta.0

### Major Changes

- 5fe7b8b: Refactor frontend into seperate plugin.

  Refactor managers in `@hijacker/core` for better organization.

### Patch Changes

- Updated dependencies [5fe7b8b]
  - @hijacker/core@2.0.0-beta.5
