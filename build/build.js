/* eslint-disable import/no-extraneous-dependencies */

import alias from 'rollup-plugin-alias';
import autoExternal from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from '../package.json';
import banner from './banner';

const input = 'src/index.js';

const output = (file, format, globals) => ({
  banner,
  name: pkg.name,
  file,
  format,
  globals: { preact: 'preact', ...globals }
});

const plugins = [
  alias({
    react: 'preact/compat',
    'react-dom': 'preact/compat'
  }),
  resolve(),
  babel({
    runtimeHelpers: true,
    externalHelpers: true
  }),
  commonjs({ include: 'node_modules/**' })
];

export default [
  {
    input,
    output: output('dist/pure.umd.js', 'umd'),
    plugins,
    external: ['preact']
  },
  {
    input,
    output: [
      output(pkg.main, 'es'),
      output(pkg.module, 'esm'),
      output('dist/pure.cjs.js', 'cjs')
    ],
    plugins: plugins.concat([autoExternal()])
  }
];
