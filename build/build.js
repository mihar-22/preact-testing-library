/* eslint-disable import/no-extraneous-dependencies */

import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import banner from './banner';

const build = (file, format) => ({
  input: 'src/index.js',
  output: {
    name: 'preact-testing-library',
    banner,
    file,
    format
  },
  plugins: [
    alias({
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }),
    resolve(),
    babel({
      runtimeHelpers: true,
      externalHelpers: true
    }),
    commonjs()
  ]
});

export default [
  build('dist/index.js', 'umd'),
  build('dist/preact-testing-library/preact.esm.js', 'esm')
];
