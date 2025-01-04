import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    viteReact(),
    electron({
      entry: "electron/main.js",
      vite: {
        build: {
          outDir: "dist-electron",
          rollupOptions: {
            external: ["electron"]
          }
        }
      }
    }),
  ],
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
  },
  base: "./",
});
