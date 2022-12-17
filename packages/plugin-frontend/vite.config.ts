import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'visualize.html'
    })
  ],
  root: './src/frontend',
  build: {
    outDir: '../../dist/frontend',
    minify: false
  }
});