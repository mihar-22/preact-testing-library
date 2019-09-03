/* eslint-disable import/no-extraneous-dependencies */

import { transformSync } from '@babel/core';
import cjsModulesTransform from '@babel/plugin-transform-modules-commonjs';
import umdModulesTransform from '@babel/plugin-transform-modules-umd';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import banner from './banner';

const defaultGlobals = {
  preact: 'preact'
};

const rollup = (
  input = './src/index.js',
  outputPrefix = 'pure',
  extraGlobals = {},
) => {
  const globals = {
    ...defaultGlobals,
    ...extraGlobals
  };

  const external = (id) => Object.prototype.hasOwnProperty.call(globals, id);

  const outputFile = (format) => `./dist/${outputPrefix}.${format}.js`;

  const fromSource = (format) => ({
    input,
    external,
    output: {
      banner,
      file: outputFile(format),
      format,
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js'],
        module: true,
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        runtimeHelpers: true,
        externalHelpers: true,
        exclude: ['node_modules/**']
      })
    ]
  });

  const fromESM = (toFormat) => ({
    input: outputFile('esm'),
    output: {
      banner,
      file: outputFile(toFormat),
      format: 'esm',
      sourcemap: false,
    },
    // The UMD bundle expects `this` to refer to the global object. By default
    // Rollup replaces `this` with `undefined`, but this default behavior can
    // be overridden with the `context` option.
    context: 'this',
    plugins: [{
      // @see https://github.com/apollographql/apollo-client/issues/4843#issuecomment-495717720
      transform(source, id) {
        const output = transformSync(source, {
          inputSourceMap: JSON.parse(fs.readFileSync(`${id}.map`)),
          sourceMaps: true,
          plugins: [
            [toFormat === 'umd' ? umdModulesTransform : cjsModulesTransform, {
              loose: true,
              allowTopLevelThis: true,
            }],
          ],
        });

        // There doesn't seem to be any way to get Rollup to emit a source map
        // that goes all the way back to the source file (rather than just to
        // the bundle.esm.js intermediate file), so we pass sourcemap:false in
        // the output options above, and manually write the CJS and UMD source
        // maps here.
        fs.writeFileSync(
          `${outputFile(toFormat)}.map`,
          JSON.stringify(output.map),
        );

        return {
          code: output.code,
        };
      }
    }],
  });

  return [
    fromSource('esm'),
    fromESM('cjs'),
    fromESM('umd'),
  ];
};

export default rollup();
