import { reactRouter } from "@react-router/dev/vite";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { vercelPreset } from "./vercel/vite";
export default defineConfig({
  plugins: [
    reactRouter({
      presets: [vercelPreset()],
    }),
    tailwind(),
  ],
});
