#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const srcHtml = 'src/editor.html';
const outSrcSvg = 'src/lsystem.svg';
const outSvg = 'lsystem.svg';
const outHtml = 'index.html';
const srcs = [{
  entryPoints: ['src/editor.js'],
  format: 'iife',
}, {
  entryPoints: ['src/lsystem.svg.onload.js'],
  format: 'esm',
}, {
  entryPoints: ['src/editor.css'],
}]

const failOnWarning = async (options) => {
  const result = await build({
    write: false,
    bundle: true,
    minify: true,
    ...options
  });
  [...result.warnings, ...result.errors]
    .map(e => console.error(e.text))
    .some(() => process.exit(1));
  return result.outputFiles[0].text.trim();
};

const [js, onload, css] = await Promise.all(srcs.map(failOnWarning));

// TODO: use terser(?): unfavor '&&' and '"'
const escaped = onload
  .replace(/"([^"\\]|\\.)*"/g, m => `'${m.slice(1, -1).replace(/'/g, "\\'")}'`)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/"/g, '&quot;')
  .replace(/\n/g, ' ');

const svg = `<svg onload="${escaped}" xmlns="http://www.w3.org/2000/svg"></svg>`;

const html = (await readFile(srcHtml, 'utf8'))
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/, `<script>${js}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/, `<style>${css}</style>`);

const writeIfChanged = async (filename, data) => {
  let buf = Buffer.from(data), old, res = '-';
  try { old = await readFile(filename); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!old || buf.compare(old)) { await writeFile(filename, buf); res = '+'; }
  console.log(`${res} ${filename}`);
};

[
  [outSrcSvg, svg], // standalone svg
  [outSvg, svg], // optional dupe for html
  [outHtml, html], // optional standalone html file
].map(e => writeIfChanged(...e));
