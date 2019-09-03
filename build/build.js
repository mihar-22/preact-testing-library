/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

import pkg from '../package.json';
import banner from './banner';

const { sizeSnapshot } = require('rollup-plugin-size-snapshot');

const rollup = (
  format,
  {
    input = './src/index.js',
    outputPrefix = `pure.${format}`,
    extraGlobals = {},
  }
) => {
  const defaultGlobals = Object.keys(pkg.peerDependencies || {}).reduce(
    (deps, dep) => {
      deps[dep] = dep;
      return deps;
    },
    {},
  );

  const file = `dist/${outputPrefix}.js`;
  const globals = { ...defaultGlobals, ...extraGlobals };
  const deps = Object.keys(pkg.dependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  const defaultExternal = (format === 'umd') ? peerDeps : deps.concat(peerDeps);
  const externalPattern = new RegExp(`^(${defaultExternal.join('|')})($|/)`);

  const externalPredicate = (id) => {
    const isDep = defaultExternal.length > 0 && externalPattern.test(id);

    if (format === 'umd') {
      // For UMD, we want to bundle all non-peer deps.
      return isDep;
    }

    // For ESM/CJs we want to make all node_modules external.
    const isNodeModule = id.includes('node_modules');
    const isRelative = id.startsWith('.');
    return isDep || (!isRelative && !path.isAbsolute(id)) || isNodeModule;
  };

  const output = {
    name: pkg.name,
    banner,
    file,
    format: (format === 'esm') ? 'es' : format,
    exports: (format === 'esm') ? 'named' : 'auto',
    globals
  };

  const replacements = Object.entries(process.env).reduce((acc, [key, value]) => {
    let val;
    if (value === 'true' || value === 'false' || Number.isInteger(+value)) {
      val = value;
    } else {
      val = JSON.stringify(value);
    }
    acc[`process.env.${key}`] = val;
    return acc;
  }, {});

  return {
    input,
    output,
    external: externalPredicate,
    plugins: [
      resolve({
        preferBuiltins: false,
        mainFields: ['module', 'main', 'jsnext', 'browser'],
      }),
      commonjs({ include: 'node_modules/**' }),
      babel({
        runtimeHelpers: true,
        externalHelpers: true,
      }),
      replace(replacements),
      sizeSnapshot({ printInfo: false })
    ]
  };
};

export default [
  rollup('esm', { outputPrefix: 'index' }),
  rollup('umd', {
    extraGlobals: {
      'preact/test-utils': 'PreactTestUtils'
    }
  }),
  rollup('cjs', {})
];
