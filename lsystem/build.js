#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

async function writeIfChange(filename, data) {
  try {
    const existingData = await readFile(filename);
    if (Buffer.compare(
      Buffer.from(data),
      existingData instanceof Buffer ? existingData : Buffer.from(existingData)
    ) === 0) {
      return;
    }
  } catch (e) { if (e.code !== 'ENOENT') { throw e; } }
  await writeFile(filename, data);
  console.log('builded - ' + filename);
}

// Standalone html (optional for PWA or http)
const [editorJsResult, editorCssResult] = await Promise.all([
  build({
    entryPoints: ['src/editor.js'],
    bundle: true,
    format: 'iife',
    // minify: true,
    write: false,
  }),
  build({
    entryPoints: ['src/editor.css'],
    bundle: true,
    write: false,
    // minify: true,
    loader: { '.css': 'css' }
  })
]);

if (editorJsResult.errors.length > 0 || editorJsResult.warnings.length > 0) {
  console.error('Build errors/warnings in editor.js');
  process.exit(1);
}

if (editorCssResult.errors.length > 0 || editorCssResult.warnings.length > 0) {
  console.error('Build errors/warnings in editor.css');
  process.exit(1);
}

const [js, css] = [editorJsResult.outputFiles[0].text, editorCssResult.outputFiles[0].text];
const html = (await readFile('src/editor.html', 'utf8'))
  .replace(/<script[^>]*src="editor\.js"[^>]*><\/script>/,
    `<script>${js}</script>`)
  .replace(/<link[^>]*href="editor\.css"[^>]*>/,
    `<style>${css}</style>`);
writeIfChange('index.html', html);

// Standalone svg
const singleQuotes = {
  name: 'singleQuotes',
  setup(build) {
    build.onEnd(result =>
      result.outputFiles.forEach(file =>
        file.contents = Buffer.from(
          file.text.replace(/"([^"\\]|\\.)*"/g, m =>
            "'" + m.slice(1, -1).replace(/'/g, "\\'") + "'"
          )
        )
      )
    );
  }
};

// mangleQuoted: true,
// plugins: [singleQuotes],
const [onloadResult, exportLsystemSvgResult] = await Promise.all([
  build({
    entryPoints: ['src/lsystem.svg.onload.js'],
    format: 'esm',
    minify: true,
    write: false,
  }),
  build({
    entryPoints: ['src/lsystem-svg.js'],
    format: 'esm',
    minify: true,
    write: false,
  })
]);

if (onloadResult.errors.length > 0 || onloadResult.warnings.length > 0) {
  console.error('Build errors/warnings in lsystem.svg.onload.js');
  process.exit(1);
}

if (exportLsystemSvgResult.errors.length > 0 || exportLsystemSvgResult.warnings.length > 0) {
  console.error('Build errors/warnings in lsystem-svg.js');
  process.exit(1);
}

const [onload, exportLsystemSvg] = [onloadResult.outputFiles[0].text, exportLsystemSvgResult.outputFiles[0].text];
if (onload.match(/["&<]/)) throw new Error('bad onload: ["&<]');
const m = exportLsystemSvg.match(/([^(]*\s)([^(\s]+)(\(.*)export\{.* as (.*)\}.*/);
const lsystemSvg = `${m[1]}${m[4]}${m[3]}`;
const svg = `<svg onload="${onload.trim().replace(/;$/, '')}" xmlns="http://www.w3.org/2000/svg"><script>/*<![CDATA[*/${lsystemSvg.trim()}//]]></script></svg>`;
writeIfChange('lsystem.svg', svg);
writeIfChange('src/lsystem.svg', svg);
