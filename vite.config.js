import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json"],
  },
  assetsInclude: ["**/*.fbx"],
  root: "src",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: true,
  },
});
