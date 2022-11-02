/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 2, { "ignoredNodes": ["PropertyDefinition"] }],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "import/no-unresolved": 0,
    "import/named": 0,
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    "linebreak-style": ["error", "unix"],
    "no-async-promise-executor": 0,
    "no-empty": 0,
    "prefer-const": ["error", {
      "ignoreReadBeforeAssign": true
    }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
};

module.exports = config;