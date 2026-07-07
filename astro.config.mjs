import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  adapter: vercel(),
  site: "https://tangram-book.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
