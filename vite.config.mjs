import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin zum Kopieren aller HTML-Dateien aus src/html nach dist/src/html
function copyHtmlPlugin() {
  return {
    name: 'copy-html',
    closeBundle() {
      const srcDir = 'src/html';
      const distDir = 'dist/src/html';
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      for (const file of readdirSync(srcDir)) {
        if (file.endsWith('.html')) {
          copyFileSync(`${srcDir}/${file}`, `${distDir}/${file}`);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [copyHtmlPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
