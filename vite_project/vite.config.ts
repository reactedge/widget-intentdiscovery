import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pkg from './package.json'
import { manifestPlugin } from './manifestPlugin'

const widgetName = 'intentdiscovery';
const version = pkg.version;
const reactGlobals = {
  'react': 'ReactEdgeSharedReact.React',
  'react-dom': 'ReactEdgeSharedReact.ReactDOM',
  'react-dom/client': 'ReactEdgeSharedReact.ReactDOMClient',
  'react/jsx-runtime': 'ReactEdgeSharedReact.JSXRuntime',
};

export default defineConfig({
  plugins: [
    react(),
    manifestPlugin({ widgetName, version }),
  ],
  define: {
    'process.env': {}
  },
  build: {
    outDir: "../www",
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: "src/widget.ts",
      name: `ReactEdge_${widgetName}`,
      fileName: () => `widget-${widgetName}@${version}.iife.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      external: Object.keys(reactGlobals),
      output: {
        globals: reactGlobals,
        inlineDynamicImports: true,
        assetFileNames: `widget-${widgetName}.[ext]`,
      },
    },
    minify: true,
    sourcemap: true
  }
})
