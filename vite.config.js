import { vitePlugin as remix } from "@remix-run/dev"
import tailwind from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    remix(),
    tailwind({
      content: ["./app/**/*.{js,jsx,ts,tsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    }),
  ],
})
