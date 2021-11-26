const esbuild = require('esbuild');
const chalk = require('chalk');

// Plugin to track build time
const timePlugin = (name) => {
  return {
    name: 'timePlugin',
    setup(build) {
      let buildStart;

      build.onStart(() => {
        buildStart = +new Date();
        console.log(`[${chalk.green(name)}] Build started`)
      });

      build.onEnd(() => {
        console.log(`[${chalk.green(name)}] Built in: ${chalk.yellow(new Date()-buildStart)}ms`)
      });
    }
  }
};

// Backend Build
esbuild.build({
  entryPoints: ['src/backend/index.ts'],
  outdir: 'output',
  platform: 'node',
  plugins: [timePlugin('Server')],
  watch: false
}).catch((e) => {
  console.log(e);
})

// Frontend Build
esbuild.build({
  entryPoints: ['src/frontend/index.js'],
  outdir: 'output/frontend',
  platform: 'browser',
  bundle: true,
  plugins: [timePlugin('Client')],
  watch: false,
  loader: { '.js': 'jsx' },
}).catch((e) => {
  console.log(e);
})