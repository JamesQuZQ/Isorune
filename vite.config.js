import { defineConfig } from "vite";
import { path } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.hdr"],
  root: ".",
  build: {
    assetsDir: "assets",
    sourcemap: true,
    minify: true,
  },
});
