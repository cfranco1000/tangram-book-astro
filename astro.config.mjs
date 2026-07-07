import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://tangram-book.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
