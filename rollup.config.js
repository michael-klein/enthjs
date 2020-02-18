import compiler from "@ampproject/rollup-plugin-closure-compiler";

export default {
  input: "lib/index.js",
  output: {
    file: "dist/enth.min.js",
    format: "es"
  },
  plugins: [compiler()]
};
