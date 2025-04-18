import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { jsxExtensionFix } from './scripts/vite-plugins/jsx-extension-fix';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
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
