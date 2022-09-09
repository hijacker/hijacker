---
sidebar_position: 2
---

# Config

Hijacker is driven by rules set up in a configuration file. By default hijacker will look for a config named `hijacker.config.js` but that can be changed with a cli command.

You can use the `defineConfig` function in order to easily get types for the config. 

```js
import { defineConfig } '@hijacker/core';

export default defineConfig({
  port: 3000,
  baseRule: {
    baseUrl: '<% API_BASE_URL %>'
  },
  rules: [{
    name: 'Hello World',
    method: 'GET',
    path: '/hello',
    skipApi: true,
    body: {
      hello: 'world'
    }
  }]
})
```

Now if you run hijacker and open up your browser to `http://localhost:3000/hello`, you should see:
```json
{
  "hello": "world"
}
```