#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

// TODO dist: cp src/index.html src/lsystem.svg manifest.json icon.svg README.md service-worker.js dst/

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
const [js, css] = (await Promise.all([
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
])).map(a => a.outputFiles[0].text);
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

const { outputFiles } = await build({
  entryPoints: ['src/lsystem.svg.onload.js', 'src/lsystem-svg.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  write: false,
  outdir: 'dist',
  // mangleQuoted: true,
  // plugins: [singleQuotes],
});
const [onload, exportLsystemSvg] = outputFiles.map(a => a.text);
if (onload.match(/["&<]/)) throw new Error('bad onload: ["&<]');
const m = exportLsystemSvg.match(/([^(]*\s)([^(\s]+)(\(.*)export\{.* as (.*)\}.*/);
const lsystemSvg = `${m[1]}${m[4]}${m[3]}`;
const svg = `<svg onload="${onload.trim().replace(/;$/, '')}" xmlns="http://www.w3.org/2000/svg"><script>//<![CDATA[
${lsystemSvg.trim()}//]]></script></svg>`;
writeIfChange('lsystem.svg', svg);
writeIfChange('src/lsystem.svg', svg);
