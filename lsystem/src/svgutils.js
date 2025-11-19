import { strings } from "./strings.js";

export function addSvgZoom(svg, parentSelector = '') {
  svg.tabIndex = 0;
  svg.style.touchAction = 'none';
  let isPanning = false;
  let startX, startY;
  let panStartViewBox = null;
  let lastTapTime = 0;
  let lastTapX = 0, lastTapY = 0;
  const rip = "svgzoomr9fg34gs6h";
  const style = document.getElementById(`${rip}css`) || (() => {
    const el = document.createElement("style");
    el.id = `${rip}css`;
    document.head.appendChild(el);
    el.sheet.insertRule(`${parentSelector} svg { cursor: grab; user-select: none; }`);
    el.sheet.insertRule(`${parentSelector} svg.panning { cursor: grabbing !important; }`);
    return el;
  })();
  const getXY = e => {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  };
  const vb = () => svg.getAttribute("viewBox").split(/\s+/).map(parseFloat);
  const rect = () => svg.getBoundingClientRect();
  const startPan = e => {
    if (e.button && e.button !== 0) return;
    const p = getXY(e);
    startX = p.x; startY = p.y;
    panStartViewBox = vb();
    isPanning = true;
    svg.classList.add('panning');
  };
  const move = e => {
    if (!isPanning) return;
    e.preventDefault();
    const p = getXY(e);
    const r = rect();
    const v = panStartViewBox;
    const scale = Math.min(r.width / v[2], r.height / v[3]);
    const dx = (p.x - startX) / scale;
    const dy = (p.y - startY) / scale;
    svg.setAttribute("viewBox", `${v[0] - dx} ${v[1] - dy} ${v[2]} ${v[3]}`);
  };
  const end = () => {
    isPanning = false;
    svg.classList.remove('panning');
  };
  const zoomAtPoint = (cx, cy, factor) => {
    const v = vb();
    const newW = v[2] / factor;
    const newH = v[3] / factor;
    const newX = cx - (cx - v[0]) / factor;
    const newY = cy - (cy - v[1]) / factor;
    svg.setAttribute("viewBox", `${newX} ${newY} ${newW} ${newH}`);
  };
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const r = rect();
    const v = vb();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const cx = v[0] + v[2] * mx / r.width;
    const cy = v[1] + v[3] * my / r.height;
    const factor = e.deltaY < 0 ? 1.3 : 1 / 1.3;
    zoomAtPoint(cx, cy, factor);
  }, { passive: false });
  const handleTap = e => {
    const now = Date.now();
    const p = getXY(e);
    if (now - lastTapTime < 400 &&
      Math.abs(p.x - lastTapX) < 30 &&
      Math.abs(p.y - lastTapY) < 30) {
      e.preventDefault();
      const r = rect();
      const v = vb();
      const cx = v[0] + v[2] * (p.x - r.left) / r.width;
      const cy = v[1] + v[3] * (p.y - r.top) / r.height;
      zoomAtPoint(cx, cy, 2);
    }
    lastTapTime = now;
    lastTapX = p.x;
    lastTapY = p.y;
  };
  svg.addEventListener("keydown", e => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      const v = vb();
      zoomAtPoint(v[0] + v[2] / 2, v[1] + v[3] / 2, 1.3);
    } else if (e.key === "-") {
      e.preventDefault();
      const v = vb();
      zoomAtPoint(v[0] + v[2] / 2, v[1] + v[3] / 2, 1 / 1.3);
    }
  });
  svg.addEventListener("mousedown", startPan);
  svg.addEventListener("touchstart", e => {
    if (e.touches.length === 1) startPan(e);
  }, { passive: false });
  svg.addEventListener("mousemove", move);
  svg.addEventListener("touchmove", move, { passive: false });
  svg.addEventListener("mouseup", end);
  svg.addEventListener("mouseleave", end);
  svg.addEventListener("touchend", end);
  svg.addEventListener("touchcancel", end);
  svg.addEventListener("dblclick", handleTap);
  svg.addEventListener("touchstart", handleTap);
  const saveTitle = document.title;
  svg.addEventListener("mousemove", e => {
    const r = rect();
    const v = vb();
    const x = v[0] + v[2] * (e.clientX - r.left) / r.width;
    const y = v[1] + v[3] * (e.clientY - r.top) / r.height;
    document.title = `${x.toFixed(1)}, ${y.toFixed(1)}`;
  });
  svg.addEventListener("mouseleave", () => document.title = saveTitle);
  svg._cleanupSvgZoom = () => {
  };
  return svg;
}

export function addSvgZoom0(svg, parentSelector = '') {
  svg.tabIndex = 0;
  function createIfAbsent(t, id) {
    return document.getElementById(id) || document.body.appendChild(
      Object.assign(document.createElement(t), { id })
    );
  }
  let isPanning = false;
  let isPinching = false;
  let startX, startY;
  let panStartViewBox = null;
  let pinchInitialDist = 0;
  let pinchInitialMidX = 0, pinchInitialMidY = 0;
  let pinchInitialViewBox = null;
  let lastTouchCount = 0;
  const rip = "svgzoomr9fg34gs6h";
  const $style = createIfAbsent("style", `${rip}css`);
  if (!$style.sheet.cssRules.length) {
    $style.sheet.insertRule(`${parentSelector} svg { cursor: grab; user-select: none; }`);
    $style.sheet.insertRule(`${parentSelector} svg.panning { cursor: grabbing !important; }`);
  }
  const getXY = (e) => {
    const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
    return { x: t.pageX, y: t.pageY };
  };
  const getCurrentViewBox = () => svg.getAttribute("viewBox").split(/\s+/).map(parseFloat);
  const startPan = (e) => {
    if (e.button !== 0 && !e.touches) return;
    const p = getXY(e);
    startX = p.x;
    startY = p.y;
    panStartViewBox = getCurrentViewBox();
    isPanning = true;
    svg.classList.add('panning');
  };
  const move = (e) => {
    if (!isPanning && !isPinching) return;
    if ((e.type === 'touchmove') && (isPanning || isPinching)) e.preventDefault();
    const p = getXY(e);
    const r = svg.getBoundingClientRect();
    if (isPanning) {
      const dx = p.x - startX;
      const dy = p.y - startY;
      const vb = panStartViewBox;
      const scaleX = r.width / vb[2];
      const scaleY = r.height / vb[3];
      const scale = Math.min(scaleX, scaleY);
      const deltaXWorld = dx / scale;
      const deltaYWorld = dy / scale;
      const newX = vb[0] - deltaXWorld;
      const newY = vb[1] - deltaYWorld;
      svg.setAttribute("viewBox", `${newX} ${newY} ${vb[2]} ${vb[3]}`);
    }
    if (isPinching && e.touches && e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      const curDist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      const curMidX = (t1.pageX + t2.pageX) / 2;
      const curMidY = (t1.pageY + t2.pageY) / 2;
      const v = pinchInitialViewBox;
      const deltaScale = curDist / pinchInitialDist;
      if (deltaScale === 0) return;
      const newW = v[2] / deltaScale;
      const newH = v[3] / deltaScale;
      const cx = v[0] + v[2] * (pinchInitialMidX - r.left) / r.width;
      const cy = v[1] + v[3] * (pinchInitialMidY - r.top) / r.height;
      const newX = cx - (cx - v[0]) / deltaScale;
      const newY = cy - (cy - v[1]) / deltaScale;
      const deltaMidX = curMidX - pinchInitialMidX;
      const deltaMidY = curMidY - pinchInitialMidY;
      const panX = - (deltaMidX / r.width) * newW;
      const panY = - (deltaMidY / r.height) * newH;
      const finalX = newX + panX;
      const finalY = newY + panY;
      svg.setAttribute("viewBox", `${finalX} ${finalY} ${newW} ${newH}`);
    }
  };
  const end = (e) => {
    if (isPanning) {
      isPanning = false;
      panStartViewBox = null;
      svg.classList.remove('panning');
    }
    if (isPinching) {
      isPinching = false;
      svg.classList.remove('panning');
    }
  };
  const handleTouch = (e) => {
    const touchCount = e.touches.length;
    if (touchCount >= 2) e.preventDefault();
    if (touchCount === 2 && lastTouchCount !== 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      pinchInitialDist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      pinchInitialMidX = (t1.pageX + t2.pageX) / 2;
      pinchInitialMidY = (t1.pageY + t2.pageY) / 2;
      pinchInitialViewBox = getCurrentViewBox();
      isPinching = true;
      svg.classList.add('panning');
    } else if (touchCount < 2 && lastTouchCount === 2) {
      end(e);
    }
    lastTouchCount = touchCount;
  };
  const onKeyDown = (e) => {
    if (e.key === '+' || e.key === '=' || e.key === '-') {
      e.preventDefault();
      const v = getCurrentViewBox();
      const cx = v[0] + v[2] / 2;
      const cy = v[1] + v[3] / 2;
      const scale = (e.key === '-' ? 1 / 1.2 : 1.2);
      const newW = v[2] / scale;
      const newH = v[3] / scale;
      const newX = cx - (cx - v[0]) / scale;
      const newY = cy - (cy - v[1]) / scale;
      svg.setAttribute("viewBox", `${newX} ${newY} ${newW} ${newH}`);
    }
  };
  svg.addEventListener("mousedown", startPan);
  svg.addEventListener("touchstart", (e) => {
    handleTouch(e);
    if (e.touches.length === 1 && !isPinching) startPan(e);
  }, { passive: false });
  ["mousemove", "touchmove"].forEach(ev => svg.addEventListener(ev, move, { passive: false }));
  ["mouseup", "touchend", "touchcancel"].forEach(ev => svg.addEventListener(ev, end));
  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = svg.getBoundingClientRect();
    const v = getCurrentViewBox();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const cx = v[0] + v[2] * mx / r.width;
    const cy = v[1] + v[3] * my / r.height;
    const scale = e.deltaY < 0 ? 1.2 : 1 / 1.2;
    const newW = v[2] / scale;
    const newH = v[3] / scale;
    const newX = cx - (cx - v[0]) / scale;
    const newY = cy - (cy - v[1]) / scale;
    svg.setAttribute("viewBox", `${newX} ${newY} ${newW} ${newH}`);
  }, { passive: false });
  svg.addEventListener("keydown", onKeyDown);
  const saveTitle = document.title;
  svg.addEventListener("mousemove", (e) => {
    const bcr = svg.getBoundingClientRect();
    const vb = getCurrentViewBox();
    const x = vb[0] + vb[2] * (e.clientX - bcr.left) / bcr.width;
    const y = vb[1] + vb[3] * (e.clientY - bcr.top) / bcr.height;
    document.title = `${x.toFixed(1)}, ${y.toFixed(1)}`;
  });
  svg.addEventListener("mouseleave", () => document.title = saveTitle);
  svg._cleanupSvgZoom = () => {
    svg.removeEventListener("keydown", onKeyDown);
  };
  return svg;
}

export function addSvgZoomOld(svg, parentSelector) {
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
