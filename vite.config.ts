import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Plugin to stub out Figma Make specific imports for local dev/testing
function figmaAssetPlugin() {
  return {
    name: 'figma-asset-stub',
    resolveId(id: string) {
      if (id.startsWith('figma:')) {
        return '\0figma-stub:' + id;
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma-stub:')) {
        // Return an empty string as the default export for any figma: import
        return 'export default "";';
      }
    },
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
