import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  if (command === "serve") {
    /* dev specific config */
    return {
      // vite config
      define: {
        __APP_ENV__: env.APP_ENV,
      },
      plugins: [vue(), eslint(), svgLoader()],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
    };
  } else {
    // command === 'build'
    return {
      // vite config
      define: {
        __APP_ENV__: env.APP_ENV,
      },
      plugins: [vue(), eslint(), svgLoader()],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
    };
  }
});
