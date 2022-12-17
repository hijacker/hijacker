# @hijacker/plugin-graphql

## 1.0.0-beta.7

### Patch Changes

- Updated dependencies [ee641a0]
  - @hijacker/core@2.0.0-beta.7

## 1.0.0-beta.6

### Patch Changes

- 519134e: Various package cleanup + Start README fixes

  Fix bug in `@hijacker/plugin-frontend` where rules werent updating on frontend.

  Change `deleteRule` to `deleteRules` in `@hijacker/core`

- 519134e: Create `@hijacker/eslint-config` and add linting to all packages
- Updated dependencies [519134e]
- Updated dependencies [519134e]
- Updated dependencies [519134e]
  - @hijacker/core@2.0.0-beta.6

## 1.0.0-beta.5

### Patch Changes

- Updated dependencies [5fe7b8b]
  - @hijacker/core@2.0.0-beta.5

## 1.0.0-beta.4

### Patch Changes

- a527f6b: Fix build for deployment. PNPM doesn't build before publish so need to add that step in.
- Updated dependencies [a527f6b]
  - @hijacker/core@2.0.0-beta.4

## 1.0.0-beta.3

### Major Changes

- 89a9657: Clean up type exporting in core. Allows everything to be exported out of `@hijacker/core` directly instead of digging in dist folder

### Patch Changes

- Updated dependencies [89a9657]
  - @hijacker/core@2.0.0-beta.3

## 1.0.0-beta.2

### Major Changes

- 9ca139f: Finish breaking graphql type out into own plugin. Will now require having `@hijacker/plugin-graphql` in order to use graphql rule type.

### Patch Changes

- Updated dependencies [9ca139f]
  - @hijacker/core@2.0.0-beta.2

## 1.0.0-beta.1

### Patch Changes

- Updated dependencies [3b9ca4d]
  - @hijacker/core@2.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- f9ad7a2: Mono repo setup. Moving frontend and rule types into plugins. Breaking change

### Patch Changes

- Updated dependencies [f9ad7a2]
  - @hijacker/core@2.0.0-beta.0
