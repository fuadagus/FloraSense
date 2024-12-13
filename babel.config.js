
module.exports = {
  presets: ['module:@react-native/babel-preset', "nativewind/babel"],
  plugins: [['dotenv-import', {
    moduleName: '@env',
    path: '.env',
  }], ["module-resolver", {
    root: ["./"],
    extensions: [".js", ".ts", ".tsx", ".jsx"],

    alias: {
      "@": "./",
      "tailwind.config": "./tailwind.config.js"
    }
  }]],
};
