function addSvgZoom(s) {
  let i = 0, X, Y, SX, SY, d = document.querySelector('#svgzoomrectangle9fg34gs6h') || document.body.appendChild(document.createElement('div'));
  s.style.cursor = 'zoom-out';
  s.onmousedown = e => {
    if (e.button) return;
    X = e.pageX; SX = scrollX;
    Y = e.pageY; SY = scrollY;
    i = 1;
  };
  s.onmousemove = e => {
    if (!i || e.button) return;
    d.style.cssText = `
left:${Math.min(X, e.pageX)}px;
top:${Math.min(Y, e.pageY)}px;
width:${Math.abs(e.pageX - X)}px;
height:${Math.abs(e.pageY - Y)}px;
cursor:${e.pageX + scrollX - 2 < X ? 'zoom-out' : 'zoom-in'}
display:block;
position:absolute;
pointer-events:none;
border:.2rem solid #17d;
background-color:#17d3;
`;
  };
  s.onmouseup = e => {
    if (e.button || !i) return;
    let r = s.getBoundingClientRect()
      , v = s.getAttribute('viewBox').split(' ').map(parseFloat)
      , x1 = v[0] + v[2] * (X + SX - r.left) / r.width
      , y1 = v[1] + v[3] * (Y + SY - r.top) / r.height
      , x2 = v[0] + v[2] * (e.pageX + scrollX - r.left) / r.width
      , y2 = v[1] + v[3] * (e.pageY + scrollY - r.top) / r.height
      ;
    console.log(y1, v[1], v[3], Y, SY, r.top, r.height);
    s.setAttribute('viewBox', e.pageX + scrollX - 2 < X + SX
      ? `${v[0] - v[2]} ${v[1] - v[3]} ${3 * v[2]} ${3 * v[3]}`
      : `${x1} ${Math.min(y1, y2)} ${x2 - x1} ${Math.abs(y2 - y1)}`
    );
    i = 0;
    d.style.display = 'none';
    s.style.cursor = 'zoom-out';
  };
  return s;
}