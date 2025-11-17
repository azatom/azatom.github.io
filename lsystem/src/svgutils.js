import { strings } from "./strings.js";

export function addSvgZoom(svg, parentSelector) {
  function createIfAbsent(t, id) {
    return document.getElementById(id) || document.body.appendChild(
      Object.assign(document.createElement(t), { id })
    );
  }
  let isDown = false;
  let startX, startY, scrollStartX = 0, scrollStartY = 0;
  const rip = "svgzoomr9fg34gs6h", $rect = createIfAbsent("div", `${rip}rect`);
  Object.assign($rect.style, { position: 'absolute', pointerEvents: 'none', display: 'none' });
  createIfAbsent("style", `${rip}css`).sheet.insertRule(`${parentSelector} svg{cursor:zoom-out}`);
  const getXY = (e) => {
    const t = e.touches ? e.touches[0] || e.changedTouches[0] : e;
    return { x: t.pageX, y: t.pageY };
  };
  const start = (e) => {
    if (e.button) return;
    const p = getXY(e);
    startX = p.x;
    startY = p.y;
    scrollStartX = window.scrollX;
    scrollStartY = window.scrollY;
    isDown = true;
  };
  const move = (e) => {
    if (!isDown || e.button) return;
    const p = getXY(e);
    const out = p.x + window.scrollX - 2 < startX;
    Object.assign($rect.style, {
      left: `${Math.min(startX, p.x)}px`,
      top: `${Math.min(startY, p.y)}px`,
      width: `${Math.abs(p.x - startX)}px`,
      height: `${Math.abs(p.y - startY)}px`,
      cursor: out ? "zoom-out" : "zoom-in",
      display: "block",
      position: "absolute",
      pointerEvents: "none",
      border: `.2rem solid ${out ? "#e82" : "#17d"}`,
      backgroundColor: out ? "#e823" : "#17d3"
    });
  };
  const end = (e) => {
    if (!isDown) return;
    const p = getXY(e);
    const r = svg.getBoundingClientRect();
    const v = svg.getAttribute("viewBox").split(" ").map(parseFloat);
    const x1 = v[0] + v[2] * (startX + scrollStartX - r.left) / r.width;
    const y1 = v[1] + v[3] * (startY + scrollStartY - r.top) / r.height;
    const x2 = v[0] + v[2] * (p.x + window.scrollX - r.left) / r.width;
    const y2 = v[1] + v[3] * (p.y + window.scrollY - r.top) / r.height;
    svg.setAttribute("viewBox",
      p.x + window.scrollX - 2 < startX + scrollStartX
        ? `${v[0] - v[2]} ${v[1] - v[3]} ${3 * v[2]} ${3 * v[3]}`
        : `${x1} ${Math.min(y1, y2)} ${x2 - x1} ${Math.abs(y2 - y1)}`
    );
    isDown = false;
    $rect.style.display = "none";
  };
  ["mousedown", "touchstart"].forEach((e) => svg.addEventListener(e, start, { passive: true }));
  ["mousemove", "touchmove"].forEach((e) => svg.addEventListener(e, move, { passive: true }));
  ["mouseup", "touchend", "touchcancel"].forEach(e => svg.addEventListener(e, end, { passive: true }));
  // ["pointerdown"].forEach((e) => svg.addEventListener(e, start), { passive: true });
  // ["pointermove"].forEach((e) => svg.addEventListener(e, move), { passive: true });
  // ["pointerup", "pointercancel"].forEach((e) => svg.addEventListener(e, end), { passive: true });
  const saveTitle = document.title;
  svg.addEventListener("mouseleave", () => document.title = saveTitle);
  svg.addEventListener("mousemove", (e) => {
    const bcr = svg.getBoundingClientRect(), vb = svg.getAttribute("viewBox").split(" ").map(parseFloat);
    vb[0] += vb[2] * (e.clientX - bcr.left) / bcr.width;
    vb[1] += vb[3] * (e.clientY - bcr.top) / bcr.height;
    document.title = `${vb[0].toFixed(1)} ${vb[1].toFixed(1)}`;
  });
  return svg;
}

export async function downloadSvg(svg, isMinimized) {
  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(svg);
  const uint8Array = new TextEncoder().encode(xmlStr);
  const blob = new Blob([uint8Array], { type: "image/svg+xml" });
  const filename = `${svg.querySelector("title")?.textContent ?? strings.untitled}.svg`;
  await downloadBlob(blob, filename);
}

export async function downloadPng(svg, m) {
  let [x, y, w, h] = svg.getAttribute("viewBox").split(" ").map(parseFloat);
  if (!svg || m === null) return;
  m = Number(m) || 3840;
  [w, h] = w < h ? [Math.ceil(m * w / h), m] : [m, Math.ceil(m * h / w)];
  const img = new Image()
    , canvas = document.createElement("canvas")
    , ctx = canvas.getContext("2d");
  img.src = "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(svg));
  await new Promise((resolve) => img.onload = resolve);
  ctx.drawImage(img, 0, 0, canvas.width = w, canvas.height = h);
  ctx.getImageData(0, 0, 1, 1);
  const blob = await new Promise((resolve, reject) => canvas.toBlob(blob => blob
    ? resolve(blob)
    : reject(new Error(strings.error)), "image/png"
  ));
  const filename = `${svg.querySelector("title")?.textContent ?? strings.untitled}.png`;
  await downloadBlob(blob, filename);
  return { w, h, s: blob.size, filename };
}

async function downloadBlob(blob, filename) {
  let url;
  try {
    url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    alert(e.message);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}
