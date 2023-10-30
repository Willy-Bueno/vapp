import path from "path"
import vue from "@vitejs/plugin-vue"
import { chunkSplitPlugin } from "vite-plugin-chunk-split"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    vue(),
    chunkSplitPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
