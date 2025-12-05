#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

async function writeIfChanged(filename, data, _buf = Buffer.from(data), _old) {
  try { _old = await readFile(filename); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (_old && Buffer.compare(_buf, _old) === 0) return;
  await writeFile(filename, _buf);
  console.log(`builded - ${filename}`);
}

// const forWoCdataPluginSingleQuotes = {name: 'singleQuotes',setup(build) {build.onEnd(result =>result.outputFiles.forEach(file =>file.contents = Buffer.from(file.text.replace(/"([^"\\]|\\.)*"/g, m =>"'" + m.slice(1, -1).replace(/'/g, "\\'") + "'"))));}};

async function buildSafe(options) {
  const result = await build({ write: false, ...options });
  const messages = [...result.warnings, ...result.errors];
  if (messages.length) {
    messages.forEach(e => console.error(e.text));
    process.exit(1);
  }
  const text = result.outputFiles[0].text;
  return options?.minify ? text.trim() : text;
}

const [js, css, onload, lsystemSvg] = await Promise.all([{
  entryPoints: ['src/editor.js'],
  format: 'iife',
  bundle: true,
}, {
  entryPoints: ['src/editor.css'],
  loader: { '.css': 'css' },
  bundle: true,
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

const htmlTemplate = await readFile('src/editor.html', 'utf8');
const html = htmlTemplate
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/, `<script>${js}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/, `<style>${css}</style>`);
const svg = `<svg onload="${onload}" xmlns="http://www.w3.org/2000/svg"><script>/*<![CDATA[*/${lsystemSvg}//]]></script></svg>`;

await Promise.all([
  writeIfChanged('index.html', html),
  writeIfChanged('lsystem.svg', svg),
  writeIfChanged('src/lsystem.svg', svg),
]);