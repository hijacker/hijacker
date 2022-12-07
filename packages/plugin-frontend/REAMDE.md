# @hijacker/plugin-frontend

Hijacker plugin that spins up a web interface to edit and modify rules.

## Usage
Install package alongside `@hijacker/core`:

```bash
npm i -D @hijacker/plugin-frontend
```

Add plugin to the plugins section of your `hijacker.config.js` file;
```javascript
import { FrontendPlugin } from '@hijacker/plugin-frontend';

export default {
  ...
  plugins: [
    new FrontendPlugin({
      port: 3001
    })
  ]
  ...
}
```

Now when you run hijacker, you can open up your browser to `http://localhost:3001` to see the interface.

## Options

| Property | Descripton | Type | Required | Default |
| -------- | ---------- | ---- | -------- | ------- |
| `port` | Port that you want the interface to run on | `number` | `yes` | |