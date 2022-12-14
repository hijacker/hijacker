# @hijacker/core

## 2.0.0-beta.6

### Major Changes

- 519134e: Various package cleanup + Start README fixes

  Fix bug in `@hijacker/plugin-frontend` where rules werent updating on frontend.

  Change `deleteRule` to `deleteRules` in `@hijacker/core`

### Minor Changes

- 519134e: Clean up `@hijacker/plugin-frontend` frontend interface and add a filter search.

### Patch Changes

- 519134e: Create `@hijacker/eslint-config` and add linting to all packages

## 2.0.0-beta.5

### Minor Changes

- 5fe7b8b: Refactor frontend into seperate plugin.

  Refactor managers in `@hijacker/core` for better organization.

## 2.0.0-beta.4

### Patch Changes

- a527f6b: Fix build for deployment. PNPM doesn't build before publish so need to add that step in.

## 2.0.0-beta.3

### Major Changes

- 89a9657: Clean up type exporting in core. Allows everything to be exported out of `@hijacker/core` directly instead of digging in dist folder

## 2.0.0-beta.2

### Major Changes

- 9ca139f: Finish breaking graphql type out into own plugin. Will now require having `@hijacker/plugin-graphql` in order to use graphql rule type.

## 2.0.0-beta.1

### Minor Changes

- 3b9ca4d: Add `defineConfig` function to support easier typing for config files

## 2.0.0-beta.0

### Major Changes

- f9ad7a2: Mono repo setup. Moving frontend and rule types into plugins. Breaking change
