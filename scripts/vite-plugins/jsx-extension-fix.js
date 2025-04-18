/**
 * Custom Vite plugin to fix JSX module import issues with GitHub Pages
 * This plugin ensures JSX files are properly processed and served with correct MIME types
 */

export function jsxExtensionFix() {
  return {
    name: 'jsx-extension-fix',

    // Resolve JSX imports without extensions
    resolveId(source, importer) {
      if (
        importer &&
        source.startsWith('.') &&
        !source.endsWith('.jsx') &&
        !source.includes('.')
      ) {
        try {
          // First try with .jsx extension
          const resolvedPath = `${source}.jsx`;
          return resolvedPath;
        } catch (error) {
          // Fall back to default resolution
          return null;
        }
      }
      return null;
    },

    // Transform JSX files to ensure they have proper JS output
    transform(code, id) {
      if (id.endsWith('.jsx')) {
        // Add a small comment to ensure the file is processed as JavaScript
        return {
          code: `/* JSX file transformed to JavaScript */\n${code}`,
          map: null,
        };
      }
      return null;
    },

    // Ensure output files have .js extensions
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith('.jsx')) {
          const jsFileName = fileName.replace('.jsx', '.js');
          bundle[jsFileName] = bundle[fileName];
          delete bundle[fileName];
        }
      });
    },
  };
}
