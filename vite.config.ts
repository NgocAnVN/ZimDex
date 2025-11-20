import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ZimDex/'   // <— bắt buộc nếu deploy lên GitHub Pages ở repo này
});
