import { build } from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';

await build({
  entryPoints: ['dist/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/bundle.cjs',
  external: [],
  minify: true,
  sourcemap: false,
  format: 'cjs'
});

// Add shebang manually to avoid syntax issues
const bundleContent = readFileSync('dist/bundle.cjs', 'utf8');
// Remove any existing shebangs first
const cleanContent = bundleContent.replace(/^#!.*\n/gm, '');
const bundleWithShebang = '#!/usr/bin/env node\n' + cleanContent;
writeFileSync('dist/bundle.cjs', bundleWithShebang);

console.log('Bundle created with shebang');