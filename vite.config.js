import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  // Adjust if hosted in a subdirectory
  plugins: [react()],
  optimizeDeps: {
    include: ["jwt-decode", "react-to-print"], // Pre-bundle jwt-decode for better performance
  },
  build: {
    target: "esnext", // Use latest JavaScript features
    outDir: "build", // Output directory for build files
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit (optional)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
