module.exports = {
  presets: [
    ['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }],
  ],
  plugins: [
    'react-native-reanimated/plugin', // This must be the last plugin
  ],
};
