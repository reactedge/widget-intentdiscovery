import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pkg from './package.json'
import { manifestPlugin } from './manifestPlugin'

const widgetName = 'intentdiscovery';

export default defineConfig({
  plugins: [
    react(),
    manifestPlugin({ widgetName }),
  ],
  define: {
    'process.env.WIDGET_NAME': JSON.stringify(widgetName)
  },
  build: {
    outDir: "../www",
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: "src/widget.ts",
      name: "WidgetUsp",
      fileName: () => `widget-${widgetName}@${pkg.version}.iife.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: `widget-${widgetName}.[ext]`,
      },
    },
    minify: true,
    sourcemap: false
  }
})