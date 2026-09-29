import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Túneles rápidos de Cloudflare (`cloudflared tunnel --url ...`) para enseñar
// el sitio desde esta máquina sin desplegar.
const tunnelHosts = [".trycloudflare.com"];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { allowedHosts: tunnelHosts },
  preview: { allowedHosts: tunnelHosts },
});
