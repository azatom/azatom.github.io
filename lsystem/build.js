#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const inJs = 'src/editor.js';
const inHelperJs = 'src/lsystem.svg.onload.js';
const inCss = 'src/editor.css';
const inHtml = 'src/editor.html';
const outSvg = 'src/lsystem.svg';
const outHtmlSvg = 'lsystem.svg';
const outHtml = 'index.html';

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

const [js, onload, css] = await Promise.all([{
  entryPoints: [inJs],
  format: 'iife',
}, {
  entryPoints: [inHelperJs],
  format: 'esm',
}, {
  entryPoints: [inCss],
}].map(failOnWarning));

// TODO: use terser(?): unfavor '&&' and '"'
const escaped = onload
  .replace(/"([^"\\]|\\.)*"/g, m => `'${m.slice(1, -1).replace(/'/g, "\\'")}'`)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/"/g, '&quot;')
  .replace(/\n/g, ' ');

const svg = `<svg onload="${escaped}" xmlns="http://www.w3.org/2000/svg"></svg>`;

const html = (await readFile(inHtml, 'utf8'))
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
  [outSvg, svg], // standalone svg
  [outHtmlSvg, svg], // optional dupe for html
  [outHtml, html], // optional standalone html file
].map(e => writeIfChanged(...e));
