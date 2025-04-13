import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { copyFileSync } from "fs";

// Copiar whatsapp-lead-dialog.html a dist/ después del build
function copyWhatsAppLeadDialog() {
  return {
    name: "copy-whatsapp-lead-dialog",
    closeBundle() {
      try {
        copyFileSync("whatsapp-lead-dialog.html", "dist/whatsapp-lead-dialog.html");
        // Si necesitas copiar otros archivos, repite aquí
      } catch (e) {
        // Silenciar error si el archivo no existe
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyWhatsAppLeadDialog()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        whatsapp: path.resolve(__dirname, "src/whatsapp-lead-dialog.tsx"),
      },
    },
  },
});
