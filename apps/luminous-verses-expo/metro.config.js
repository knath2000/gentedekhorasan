// metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure resolver.extraNodeModules exists
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};

// Polyfill Node.js core modules
config.resolver.extraNodeModules.stream = require.resolve('readable-stream');
config.resolver.extraNodeModules.events = require.resolve('events');
config.resolver.extraNodeModules.https = require.resolve('https-browserify');
config.resolver.extraNodeModules.http = require.resolve('stream-http');
config.resolver.extraNodeModules.crypto = require.resolve('crypto-browserify');
config.resolver.extraNodeModules.url = require.resolve('url');
config.resolver.extraNodeModules.net = require.resolve('react-native-tcp-socket');
config.resolver.extraNodeModules.tls = require.resolve('react-native-tcp-socket');
config.resolver.extraNodeModules.path = require.resolve('path-browserify');
config.resolver.extraNodeModules.os = require.resolve('os-browserify/browser');
config.resolver.extraNodeModules.assert = require.resolve('assert/'); // Note the trailing slash
config.resolver.extraNodeModules.vm = require.resolve('vm-browserify');
config.resolver.extraNodeModules.zlib = require.resolve('browserify-zlib');
// You might need to add more here if other Node.js core modules are imported
// e.g., 'fs', 'async_hooks'. For Supabase, these cover most common needs.

// Add 'json' to assetExts if it's not already there,
// especially for Lottie animations.
// Metro's default assetExts include common image and font types,
// but sometimes .json for Lottie needs to be explicitly added.
if (!config.resolver.assetExts.includes('json')) {
  config.resolver.assetExts.push('json');
}

// Add woff and woff2 to assetExts for web font support
if (!config.resolver.assetExts.includes('woff')) {
  config.resolver.assetExts.push('woff');
}
if (!config.resolver.assetExts.includes('woff2')) {
  config.resolver.assetExts.push('woff2');
}

// You might also need to ensure 'cjs' is in sourceExts if you have
// CJS modules, though for Lottie this is usually about assetExts.
// Example:
// if (!config.resolver.sourceExts.includes('cjs')) {
//   config.resolver.sourceExts.push('cjs');
// }

module.exports = config;