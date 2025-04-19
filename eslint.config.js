import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...prettierConfig.rules,
    },
  },
];
