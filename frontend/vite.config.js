/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@style": path.resolve(__dirname, "./src/style"),
        "@layout": path.resolve(__dirname, "./src/layout"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@constants": path.resolve(__dirname, "./src/constants"),
        "@context": path.resolve(__dirname, "./src/context"),
      },
    }
})
