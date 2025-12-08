#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { minify } from 'terser';

const srcHtml = 'src/editor.html';
const outSrcSvg = 'src/lsystem.svg';
const outSvg = 'lsystem.svg';
const outHtml = 'index.html';
const srcs = [{
  entryPoints: ['src/editor.js'],
  format: 'iife',
  // minify: true,
}, {
  entryPoints: ['src/lsystem.svg.onload.js'],
  format: 'esm',
  // minify: true,
}, {
  entryPoints: ['src/editor.css'],
  // minify: true,
}]

const failOnWarning = async (options) => {
  options = {
    write: false,
    bundle: true,
    minify: true,
    ...options
  };
  const result = await build(options);
  [...result.warnings, ...result.errors]
    .map(e => console.error(e.text))
    .some(() => process.exit(1));
  return options?.minify
    ? result.outputFiles[0].text.trim()
    : result.outputFiles[0].text;
};
const terseropts = {
  compress: {
    defaults: true,
    dead_code: true,
    booleans: true,
    conditionals: true,
  },
  format: { quote_style: 1, },
  mangle: true,
};

const [js, onload, css] = await Promise.all(srcs.map(failOnWarning));
const [js2, onload2] = await Promise.all([js, onload].map(a => minify(a, terseropts)));

const html = (await readFile(srcHtml, 'utf8'))
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/, `<script>${js2.code}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/, `<style>${css}</style>`);

const onload3 = onload2.code
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/"/g, '&quot;');

if (/\n|\r/.test(onload3)) throw new Error('newline');

const svg = `<svg onload="${onload3}" xmlns="http://www.w3.org/2000/svg"></svg>`;

const writeIfChanged = async (filename, data) => {
  let buf = Buffer.from(data), old, res = '-';
  try { old = await readFile(filename); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!old || buf.compare(old)) { await writeFile(filename, buf); res = '+'; }
  console.log(`${res} ${filename} ${buf.length}`);
};

[
  [outSrcSvg, svg], // standalone svg
  [outSvg, svg], // optional dupe for html
  [outHtml, html], // optional standalone html file
].map(e => writeIfChanged(...e));
