function addSvgZoom(s) {
  let isDown = false, startX, startY, scrollStartX, scrollStartY;
  let rectDiv = document.querySelector('#svgzoomrectangle9fg34gs6h')
    || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'svgzoomrectangle9fg34gs6h' }));

  rectDiv.style.position = 'absolute';
  rectDiv.style.pointerEvents = 'none';
  rectDiv.style.display = 'none';

  s.style.cursor = 'zoom-out';

  const getXY = e => {
    const t = e.touches ? e.touches[0] || e.changedTouches[0] : e;
    return { x: t.pageX, y: t.pageY };
  };

  const start = e => {
    if (e.button) return;
    const p = getXY(e);
    startX = p.x; startY = p.y;
    scrollStartX = scrollX; scrollStartY = scrollY;
    isDown = true;
  };

  const move = e => {
    if (!isDown || e.button) return;
    const p = getXY(e), out = p.x + scrollX - 2 < startX;
    rectDiv.style.cssText = `
      left:${Math.min(startX, p.x)}px;
      top:${Math.min(startY, p.y)}px;
      width:${Math.abs(p.x - startX)}px;
      height:${Math.abs(p.y - startY)}px;
      cursor:${out ? 'zoom-out' : 'zoom-in'};
      display:block;
      position:absolute;
      pointer-events:none;
      border:.2rem solid ${out?'#e82':'#17d'};
      background-color:${out?'#e823':'#17d3'};
    `;
  };

  const end = e => {
    if (!isDown) return;
    const p = getXY(e);
    const r = s.getBoundingClientRect();
    const v = s.getAttribute('viewBox').split(' ').map(parseFloat);

    const x1 = v[0] + v[2] * (startX + scrollStartX - r.left) / r.width;
    const y1 = v[1] + v[3] * (startY + scrollStartY - r.top) / r.height;
    const x2 = v[0] + v[2] * (p.x + scrollX - r.left) / r.width;
    const y2 = v[1] + v[3] * (p.y + scrollY - r.top) / r.height;

    if (p.x + scrollX - 2 < startX + scrollStartX) {
      s.setAttribute('viewBox', `${v[0] - v[2]} ${v[1] - v[3]} ${3 * v[2]} ${3 * v[3]}`);
    } else {
      s.setAttribute('viewBox', `${x1} ${Math.min(y1, y2)} ${x2 - x1} ${Math.abs(y2 - y1)}`);
    }

    isDown = false;
    rectDiv.style.display = 'none';
    s.style.cursor = 'zoom-out';
  };

  ['mousedown', 'touchstart'].forEach(e => s.addEventListener(e, start));
  ['mousemove', 'touchmove'].forEach(e => s.addEventListener(e, move));
  ['mouseup', 'touchend', 'touchcancel'].forEach(e => s.addEventListener(e, end));

  return s;
}
