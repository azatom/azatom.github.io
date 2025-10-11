function addSvgZoom(b) {
  (d = document.createElement("div")).style.cssText =
    "position:absolute;border:.1rem dashed #000;pointer-events:none;display:none",
    document.body.appendChild(d);
  let t, o, i = 0;
  return b.onmousedown = n => {
    let s = b.getBoundingClientRect()
      , p = b.getAttribute("viewBox").split(" ").map(parseFloat);
    t = p[0] + p[2] * (n.pageX - s.left + scrollX) / s.width,
      o = p[1] + p[3] * (n.pageY - s.top + scrollY) / s.height,
      i = [n.pageX, n.pageY],
      d.style.display = "block",
      b.style.cursor = "crosshair";
  }
    , b.onmousemove = n => {
      if (!i) return;
      let t = Math.min(i[0], n.pageX)
        , o = Math.min(i[1], n.pageY);
      d.style.cssText = `position:absolute;border:1px dashed #000;pointer-events:none;
            left:${t}px;top:${o}px;width:${Math.abs(n.pageX - i[0])}px;height:${Math.abs(n.pageY - i[1])}px`;
      b.style.cursor = i[0] > n.pageX ? "zoom-out" : "zoom-in";
    }
    , b.onmouseup = n => {
      if (!i) return;
      let s = b.getBoundingClientRect()
        , p = b.getAttribute("viewBox").split(" ").map(parseFloat)
        , a = p[0] + p[2] * (n.pageX - s.left + scrollX) / s.width
        , l = p[1] + p[3] * (n.pageY - s.top + scrollY) / s.height;
      b.setAttribute("viewBox", a < t
        ? `${p[0] - p[2]} ${p[1] - p[3]} ${3 * p[2]} ${3 * p[3]}`
        : `${t} ${Math.min(o, l)} ${a - t} ${Math.abs(l - o)}`),
        i = 0,
        d.style.display = "none",
        b.style.cursor = "";
    }
    , b;
}
