---
sidebar_position: 1
---

# Install

There are couple ways to choose from when setting up hijacker.

## Local
```bash
npm i -D @hijacker/core
```

If you choose to install hijacker to a project, you need to create a script for it in your `package.json`:

```json
{
  ...,
  "scripts": {
    "hijacker": "hijacker"
  },
  ...
}
```

## Global
```bash
npm i -g @hijacker/core
```

Installing hijacker locally will allow you to run the `hijacker` command anywhere in your terminal.

## NPX
Hijacker can be ran without installing with npx. Run the following command in a folder with a hijacker config file.
```bash
npx @hijacker/core
```