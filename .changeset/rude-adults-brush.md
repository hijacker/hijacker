---
"@hijacker/plugin-frontend": major
"@hijacker/plugin-graphql": major
"@hijacker/eslint-config": major
"@hijacker/core": major
---

Convert to zod types

Switch to zod and refactor all types to using it. Breaking change because some types are renamed as well as moving types around.

Types renamed:
`HijackerRequest` -> `HttpRequest`
`HijackerResponse` -> `HttpResponse`
`Request` -> `HijackerRequest`