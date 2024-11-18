import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  input: "http://localhost:8000/api/v1/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/client",
  },
  plugins: [
    "@hey-api/schemas",
    "@hey-api/services",
    "@hey-api/types",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
  ],
});
