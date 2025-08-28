import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      { find: "@pages", replacement: resolve(__dirname, "src/pages") },
      { find: "@components", replacement: resolve(__dirname, "src/components") },
      { find: "@styles", replacement: resolve(__dirname, "src/styles") },
      { find: "@assets", replacement: resolve(__dirname, "src/assets") },
      { find: "@models", replacement: resolve(__dirname, "src/models") },
    ],
  },
});