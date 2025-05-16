const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
  // Create the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Passing true will enable the default Workbox + Manifest plugins.
      offline: false,
      // Set to true to generate a bundle stats file for analysis.
      // You can also pass a string to define the output path.
      // analyze: true, // Option 1: Expo's built-in analyzer flag (might be simpler)
      babel: {
        dangerouslyAddModulePathsToTranspile: [],
        // Target modern browsers to avoid unnecessary transpilation
        targets: {
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Safari versions',
            'last 2 Edge versions'
          ]
        }
      }
    },
    argv
  );

  // Add the BundleAnalyzerPlugin if in production mode and analyze flag is set
  // For more control, we add it manually.
  if (env.mode === 'production' && process.env.ANALYZE_BUNDLE) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generates an HTML file report
        reportFilename: 'webpack-bundle-report.html',
        openAnalyzer: true, // Opens the report in the browser automatically
      })
    );
  }

  // Customize the config before returning it.
  // For example, to add a new loader or plugin.
  // config.module.rules.push({ test: /\.mjs$/, include: /node_modules/, type: "javascript/auto" });

  return config;
};