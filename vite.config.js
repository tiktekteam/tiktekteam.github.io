import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { jsxExtensionFix } from './scripts/vite-plugins/jsx-extension-fix';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Ensure all JSX is transformed to JS
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          // Force JSX files to be transformed completely
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
    jsxExtensionFix(),
    // Custom plugin to handle JSX MIME types
    {
      name: 'configure-jsx-mime-type',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Check for both .jsx extension and potential query parameters
          if (req.url.includes('.jsx')) {
            res.setHeader('Content-Type', 'application/javascript');
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          // Check for both .jsx extension and potential query parameters
          if (req.url.includes('.jsx')) {
            res.setHeader('Content-Type', 'application/javascript');
          }
          next();
        });
      },
    },
    // Additional plugin to rename all JSX files to JS in output
    {
      name: 'force-jsx-to-js',
      generateBundle(options, bundle) {
        Object.keys(bundle).forEach((fileName) => {
          if (fileName.endsWith('.jsx')) {
            const newFileName = fileName.replace('.jsx', '.js');
            bundle[newFileName] = bundle[fileName];
            delete bundle[fileName];
          }
        });
      },
    },
  ],
  base: '/', // Base path for GitHub Pages deployment
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Ensure JSX files are treated as JavaScript modules
        entryFileNames: 'assets/[name].js', // Remove [hash] for easier debugging
        chunkFileNames: 'assets/[name].js', // Remove [hash] for easier debugging
        assetFileNames: 'assets/[name].[ext]', // Remove [hash] for easier debugging
      },
    },
    // Force JSX files to be output as .js files
    assetsInlineLimit: 0,
    sourcemap: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});
