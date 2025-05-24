// next.config.js
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  transpilePackages: ["expo-router", "expo", "react-native", "react-native-web", "expo-modules-core"],
  reactStrictMode: true,
  output: 'export',
});