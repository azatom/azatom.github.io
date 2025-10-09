function addSvgZoom(svg) {
    svg.addEventListener('click', ((x0, y0) => e => {
        let s = e.target.closest('svg')
            , [x, y, w, h] = s.getAttribute('viewBox').split(' ').map(v => parseFloat(v))
            , r = s.getBoundingClientRect()
            , x1 = x + w * ((e.pageX - r.left + window.scrollX) / r.width)
            , y1 = y + h * ((e.pageY - r.top - window.scrollY) / r.height);
        if (x0 !== null) {
            [x, y, w, h] = x0 > x1 ? [x - w, y - h, w * 3, h * 3]
                : [x0, Math.min(y0, y1), x1 - x0, Math.abs(y1 - y0)];
            s.setAttribute('viewBox', [x, y, w, h].join(' '));
            [x0, y0] = [null, null];
        } else {
            [x0, y0] = [x1, y1];
        }
    })(null, null));
    return svg;
}