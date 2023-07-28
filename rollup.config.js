const resolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel');
const copy = require('rollup-plugin-copy');
const postcss = require('rollup-plugin-postcss');
const path = require('path');
const glob = require('glob');

const { ROLLUP_WATCH } = process.env;

function createCssAndIndexFile({ dest, format, file, files }) {
  return {
    name: 'createCssAndIndexFile',
    generateBundle(options, bundle) {
      console.log('dest', dest);
      this.emitFile({
        name: 'css.js',
        fileName: `${dest}/css.js`,
        type: 'asset',
        source:
          format === 'esm'
            ? `
import '../../style/index.css';
import './index.css';
        `
            : `
require('../../style/index.css');
require('./index.css');
`,
      });

      this.emitFile({
        name: 'index.js',
        fileName: `${dest}/index.js`,
        type: 'asset',
        source:
          format === 'esm'
            ? `
import '../../style/index.less';
import './index.less';
        `
            : `
require('../../style/index.less');
require('./index.less');
`,
      });

      if (file.includes('components/style/index.less') && format === 'esm') {
        const code = files
          .filter((item) => item !== file)
          .map((item) => {
            return `@import "${item.replace('components', '..')}"`;
          })
          .join(',')
          .replace(',', ';\n');
        this.emitFile({
          name: 'components.less',
          fileName: `${dest}/components.less`,
          type: 'asset',
          source: `${code};`,
        });
      }

      delete bundle['index.js'];
      delete bundle['index.js.map'];
    },
  };
}

function createComponentsLessFile() {
  return {
    name: 'createCssAndIndexFile',
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((filename) => {
        if (!filename.includes('antd')) {
          delete bundle[filename];
        }
      });
      this.emitFile({
        name: 'antd.less',
        fileName: 'antd.less',
        type: 'asset',
        source: `
@import "../es/style/index.less";
@import "../es/style/components.less";
        `,
      });
    },
  };
}

const dirMap = {
  esm: 'es',
  cjs: 'lib',
  umd: 'dist',
};

const _createStyleConfig = (file, format, files) => {
  const dir = dirMap[format];
  const styleDir = path.dirname(file);
  const isStyleIndex = file.includes('components/style/index.less');
  return {
    input: file,
    output: {
      format,
      entryFileNames: '[name].js',
      exports: 'named',
      preserveModules: false,
      sourcemap: true,
      dir,
    },
    plugins: [
      copy({
        copyOnce: true,
        targets: isStyleIndex
          ? [
              { src: file, dest: styleDir.replace('components', dir) },
              { src: 'components/style/themes/*.less', dest: `${styleDir.replace('components', dir)}/themes` },
              { src: 'components/style/mixins/*.less', dest: `${styleDir.replace('components', dir)}/mixins` },
              { src: 'components/style/core/*.less', dest: `${styleDir.replace('components', dir)}/core` },
            ]
          : [{ src: file, dest: styleDir.replace('components', dir) }],
      }),
      postcss({
        extensions: ['.less', '.css', '.sss', '.pcss'],
        extract: path.resolve(`${styleDir}/index.css`.replace('components', dir)),
      }),
      createCssAndIndexFile({
        dest: styleDir.replace('components/', ''),
        format,
        file,
        files,
      }),
    ],
  };
};

const files = glob.sync('components/**/*.less', {
  ignore: ['**/themes/*.less', '**/mixins/*.less', '**/core/*.less'],
});

const createStyleConfig = () => {
  console.log('files', files);

  return files.reduce((prev, file) => {
    const result = (ROLLUP_WATCH ? ['esm'] : ['esm', 'cjs']).map((format) => {
      return _createStyleConfig(file, format, files);
    });
    // console.log('prev', prev, result)
    return [...prev, ...result];
  }, []);
};

function createJsConfig() {
  return (ROLLUP_WATCH ? ['esm'] : ['esm', 'cjs', 'umd']).map((format) => {
    return {
      input: ['components/index.ts'],
      treeshake: false,
      output:
        format === 'umd'
          ? {
              format,
              entryFileNames: '[name].umd.js',
              preserveModules: false,
              sourcemap: true,
              file: 'dist/antd.js',
              name: 'antd',
              globals: {
                react: 'react',
                reactDom: 'react-dom',
              },
            }
          : {
              format,
              entryFileNames: '[name].js',
              exports: 'named',
              preserveModules: true,
              sourcemap: true,
              dir: dirMap[format],
            },
      plugins: [
        resolve({
          browser: true,
        }),
        json({}),
        commonjs({
          transformMixedEsModules: true,
        }),
        typescript({
          declaration: format !== 'umd',
          declarationDir: format !== 'umd' ? dirMap[format] : null,
          noEmitOnError: false,
        }),
        babel({
          babelHelpers: 'runtime',
          exclude: [/node_modules/],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'],
        }),
      ],
      external: ['react'],
    };
  });
}

const styleConfigs = createStyleConfig();
const jsConfigs = createJsConfig();

const umdCss = {
  input: files,
  output: {
    format: 'esm',
    entryFileNames: '[name].my.js',
    exports: 'named',
    dir: 'dist',
  },
  plugins: [
    postcss({
      extensions: ['.less', '.css', '.sss', '.pcss'],
      extract: 'antd.css',
    }),
    createComponentsLessFile(),
  ],
};

module.exports = [...jsConfigs, ...styleConfigs, ROLLUP_WATCH ? null : umdCss].filter((item) => item);
