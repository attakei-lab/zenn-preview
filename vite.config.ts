import { defineConfig } from 'vite';
import build from '@hono/vite-build';

export default defineConfig({
  plugins: [build({ entry: './src/index.tsx' })],
});
