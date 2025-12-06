#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const failOnWarning = async (options) => {
  const result = await build({
    write: false,
    bundle: true,
    minify: true,
    loader: { '.css': 'css' },
    ...options
  });
  [...result.warnings, ...result.errors]
    .map(e => console.error(e.text))
    .some(() => process.exit(1));
  return result.outputFiles[0].text.trim();
};

const [js, onload, css] = await Promise.all([{
  entryPoints: ['src/editor.js'],
  format: 'iife',
}, {
  entryPoints: ['src/lsystem.svg.onload.js'],
  format: 'esm',
}, {
  entryPoints: ['src/editor.css'],
}].map(failOnWarning));

const preferAposAndEsc = s => s
  .replace(/"([^"\\]|\\.)*"/g, match => "'" + match.slice(1, -1).replace(/'/g, "\\'") + "'")
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/"/g, '&quot;')
  .replace(/\n/g, ' ');

const svg = `<svg onload="${preferAposAndEsc(onload)}" xmlns="http://www.w3.org/2000/svg"></svg>`;
const html = (await readFile('src/editor.html', 'utf8'))
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/, `<script>${js}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/, `<style>${css}</style>`);

const writeIfChanged = async (filename, data) => {
  let buf = Buffer.from(data), old, res = '✗';
  try { old = await readFile(filename); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!old || buf.compare(old)) { await writeFile(filename, buf); res = '✓'; }
  console.log(`${res} ${filename}`);
};

[
  ['index.html', html], // optional standalone html file
  ['src/lsystem.svg', svg], // needed for both
  ['lsystem.svg', svg], // dupe
].map(e => writeIfChanged(...e));
