import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 1,
    chunkSizeWarningLimit: 4096,
    minify: 'terser',
    terserOptions: { format: { comments: false } },
  },
  plugins: [react()],
  assetsInclude: ['**/*.md'],
});
