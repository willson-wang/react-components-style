'use strict';

module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        debug: false,
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true,
      },
    ],
  ],
};
