/* eslint-disable global-require */

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const packageName = 'mtproto-js';
const entryFile = 'src/index.ts';
const formats = ['cjs', 'umd', 'es'];
const inlineDynamicImports = false;

export default [
  // js only
  {
    input: entryFile,
    inlineDynamicImports,
    output: [
      ...formats.map((format) => ({
        name: packageName,
        file: `dist/${format}/${packageName}.js`,
        format,
      })),
      ...formats.map((format) => ({
        name: packageName,
        file: `dist/${format}/${packageName}.min.js`,
        format,
        plugins: [terser()],
      })),
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
        include: ['src/**/*'],
        exclude: ['*.test.ts'],
      }),
      resolve({
        jsnext: true,
        main: false,
      }),
    ],
  },

  // declaration
  {
    input: entryFile,
    output: {
      dir: 'dist/typings',
    },
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        incremental: false,
        outDir: 'dist/typings',
        target: 'es5',
        rootDir: 'src',
        exclude: ['*.test.ts'],
        include: ['src/**/*'],
      }),
    ],
  },
];
