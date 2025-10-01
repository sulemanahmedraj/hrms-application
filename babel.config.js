module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env',         // this is what you import from
          path: '.env',               // path to your .env file
          allowUndefined: true
        }]
      ],
  
    };
  };