import { createServer } from 'vite';
import { ViteNodeRunner } from 'vite-node/client';
import { ViteNodeServer } from 'vite-node/server';


export const tsImporter = async (file: string) => {
  const server = await createServer({
    optimizeDeps: {
      disabled: true,
    },
  });

  await server.pluginContainer.buildStart({});

  // create vite-node server
  const node = new ViteNodeServer(server);

  // create vite-node runner
  const runner = new ViteNodeRunner({
    root: server.config.root,
    base: server.config.base,
    fetchModule(id) {
      return node.fetchModule(id);
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer);
    },
  });

  // execute the file
  const config = await runner.executeFile(file);

  // close the vite server
  await server.close();

  return config.default;
};