#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

// a plugin for svg without cdata, prefer single quotes in attr: {name: 'singleQuotes',setup(build) {build.onEnd(result =>result.outputFiles.forEach(file =>file.contents = Buffer.from(file.text.replace(/"([^"\\]|\\.)*"/g, m =>"'" + m.slice(1, -1).replace(/'/g, "\\'") + "'"))));}};

const buildSafe = async (options) => {
  const result = await build({ write: false, ...options });
  [...result.warnings, ...result.errors]
    .map(e => console.error(e.text))
    .some(() => process.exit(1));
  const text = result.outputFiles[0].text;
  return options?.minify ? text.trim() : text;
};

const [js, css, onload, lsystemSvg] = await Promise.all([{
  entryPoints: ['src/editor.js'],
  format: 'iife',
  bundle: true,
  // minify: true,
}, {
  entryPoints: ['src/editor.css'],
  loader: { '.css': 'css' },
  bundle: true,
  // minify: true,
}, {
  entryPoints: ['src/lsystem.svg.onload.js'],
  format: 'esm',
  minify: true,
}, {
  entryPoints: ['src/lsystem-svg.exportwrapper.js'],
  format: 'iife',
  bundle: true,
  minify: true,
}].map(buildSafe));

if (onload.match(/["&<\n]/)) throw new Error('bad svg: /["&<\\n]/');

const html = (await readFile('src/editor.html', 'utf8'))
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/, `<script>${js}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/, `<style>${css}</style>`);
const svg = `<svg onload="${onload}" xmlns="http://www.w3.org/2000/svg"><script>/*<![CDATA[*/${lsystemSvg}//]]></script></svg>`;

const writeIfChanged = async (filename, data) => {
  let buf = Buffer.from(data), old;
  try { old = await readFile(filename); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!old || buf.compare(old)) return writeFile(filename, buf);
};

await Promise.all([
  ['index.html', html], // optional standalone html file
  ['src/lsystem.svg', svg], // needed for both
  ['lsystem.svg', svg], // dupe
].map(e => writeIfChanged(...e)));
