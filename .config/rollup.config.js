import * as path from 'path';

import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

const { name } = pkg;
const config = (outFile, format, plugins) => ({
  input: './tmp/index.js',
  output: {
    file: path.join('./lib', outFile),
    format: format,
    globals: {
      mobx: 'mobx',
      mst: 'mobx-state-tree',
      nanoid: 'nanoid',
    },
  },
  external: ['mobx', 'mobx-state-tree', 'nanoid'],
  plugins,
});

export default [
  config(`${name}.js`, 'cjs', [resolve(), filesize()]),
  config(`${name}.min.js`, 'cjs', [resolve(), terser(), filesize()]),
  config(`${name}.module.js`, 'es', [
    resolve(),
    filesize(),
    copy({
      targets: [
        {
          src: ['tmp/**/*.d.ts', '!tmp/__tests__/**', '!tmp/__benchmark__/**', '!tmp/__mocks__/**'],
          dest: 'lib',
        },
      ],
      flatten: false,
    }),
  ]),
];
