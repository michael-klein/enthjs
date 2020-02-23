import compiler from "@ampproject/rollup-plugin-closure-compiler";

export default {
  input: "src/index.js",
  output: {
    file: "dist/enth.min.js",
    format: "es"
  },
  plugins: [
    compiler({
      compilation_level: "ADVANCED"
    })
  ]
};
