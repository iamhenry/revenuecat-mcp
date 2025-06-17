import { build } from 'esbuild';

await build({
  entryPoints: ['dist/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/bundle.cjs',
  external: [],
  minify: true,
  sourcemap: false,
  banner: {
    js: '#!/usr/bin/env node'
  },
  format: 'cjs'
});