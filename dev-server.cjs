/* eslint-disable @typescript-eslint/no-var-requires */
const { join, basename } = require('node:path');
const { copyFileSync } = require('node:fs');

const { green, yellow } = require('colorette');
const esbuild = require('esbuild');
const glob = require('glob');

// Plugin to track build time
const timePlugin = (name) => {
  return {
    name: 'timePlugin',
    setup(build) {
      let buildStart;

      build.onStart(() => {
        buildStart = +new Date();
        console.log(`[${green(name)}] Build started`);
      });

      build.onEnd(() => {
        console.log(`[${green(name)}] Built in: ${yellow(new Date()-buildStart)}ms`);
      });
    }
  };
};

const htmlPlugin = ({
  htmlFile,
  outDir
}) => {
  return {
    name: 'htmlPlugin',
    setup(build) {
      const src = join(process.cwd(), htmlFile);
      const dest = join(process.cwd(), outDir, basename(htmlFile));

      build.onEnd((res) => {
        copyFileSync(src, dest);
      })
    }
  }
}

// Very basic hot reload for backend. Just tears everything down before rebuild and starts everything back up after.
// Would be cool to hook this up to a CLI to add new rules/manual restarts and other debug tools
const backendRefresh = () => {
  return {
    name: 'backendRefresh',
    setup(build) {
      let hijackerModule;
      let hijackerServer;

      build.onStart(async () => {
        // Clear require cache so everything gets updated correctly
        // Can possibly optimize this to just delete hijacker modules
        Object.keys(require.cache).forEach((x) => {
          delete require.cache[x];
        });

        if (hijackerServer) {
          await hijackerServer.close();
          hijackerServer = undefined;
          hijackerModule = undefined;
        }
      });

      build.onEnd(async () => {
        hijackerModule = await import(`./dist/hijacker.js?t=${+new Date()}`);

        hijackerServer = new hijackerModule.Hijacker({
          port: 3000,
          baseRule: {
            baseUrl: "https://jsonplaceholder.typicode.com"
          },
          rules: [
            {
              path: "/cars",
              skipApi: true,
              body: {
                Hello: "World"
              }
            }
          ]
        });
      });
    }
  };
};

(async () => {
  const devServer = process.argv.includes('--dev');
  
  // Backend Build
  esbuild.build({
    entryPoints: glob.sync('src/**/!(*.spec).ts', { ignore: 'src/frontend/**' }),
    outdir: 'dist',
    platform: 'node',
    format: 'esm',
    plugins: [
      timePlugin('server'),
      // Plugins to only run during dev mode
      ...(devServer ? [backendRefresh()] : [])
    ],
    watch: devServer
  }).catch((e) => {
    console.log(e);
  });

  // Frontend Build
  esbuild.build({
    entryPoints: ['src/frontend/index.js'],
    outdir: 'dist/frontend/static',
    platform: 'browser',
    bundle: true,
    plugins: [
      timePlugin('client'), 
      htmlPlugin({
        outDir: 'dist/frontend',
        htmlFile: 'src/frontend/index.html'
      })
    ],
    watch: devServer,
    loader: { '.js': 'jsx' },
  }).catch((e) => {
    console.log(e);
  });

  // Bin build
  if (!devServer) {
    esbuild.build({
      entryPoints: ['src/bin/hijacker.ts'],
      outdir: 'dist/bin',
      platform: 'node',
      format: 'esm',
      plugins: [timePlugin('bin')],
      watch: false,
      define: {
        HIJACKER_MODULE: '\'../hijacker\''
      }
    }).catch((e) => {
      console.log(e);
    });
  }
})();
