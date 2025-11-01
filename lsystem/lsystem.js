function createSvg(R = 'S=SF+SF-SF', svg) {
  R = 'string' === typeof R ? Object.fromEntries(R
    .replace(/&/g, ',').replace(/([^,:=]*)[:=]([^,:=]*)/g, '$1=$2')
    .split(',').map(a => a.split('='))) : R;
  let T = performance.now(), [x, y, a, b, q, O] = Array(9).fill(0), d = '', p = 1, i, j, Q = Math.PI / 2;
  R.S ??= 'F'; R._a = R._a ? R._a === 'q' ? 180 * (3 - Math.sqrt(5)) : R._a : 90; R._n ??= 1; R._l ??= 9; R._m ??= Q;
  const z = [], B = R._a / 90
    , Z = Object.fromEntries(Object.entries(R).filter(([k]) => k.endsWith('2')).map(([k, v]) => [k[0], v]))
    , u = n => Z && n === R._n ? Z : R
    , o = a => +parseFloat(a).toPrecision(12)
    , f = f => R._l * Math.pow(R._m, q) * f(Q * (a * B + b))
    , C = (t, a, ...b) => {
      t = document.createElementNS('http://www.w3.org/2000/svg', t);
      for (i in a) t.setAttribute(i, a[i]);
      b?.map(b => t.prepend(b));
      return t;
    }, grid = {}, D = ((E = 1e-4, F = 9 * E) => {
      let lines = new Set(), [px, py] = align(x, y), pxy = `${px},${py}`, dxy
        , mx = 1 / 0, Mx = -1 / 0, my = mx, My = Mx, _min = mx, _max = Mx, _cmp = 0;
      function oo(s) { return s.split(',').map(o).join(','); }
      function align(X, Y) {
        let D = Infinity, P, ps, p, d, i, j, k
          , x = Math.floor(X / F), y = Math.floor(Y / F), e = Math.ceil(E / F);
        for (j = -e; j <= e; j++) for (i = -e; i <= e; i++) {
          ps = grid[`${x + i},${y + j}`];
          if (ps) for (k = 0; k < ps.length; k++) {
            p = ps[k]; d = Math.hypot(p[0] - X, p[1] - Y); if (d < D) { D = d; P = p; }
            _cmp++; _max < d && d < E && (_max = d); E < d && d < _min && (_min = d);
          }
        }
        if (D >= E) (grid[`${x},${y}`] ??= []).push(P = [X, Y]);
        return P;
      }
      return {
        stat: function (ts = a => a >= 1e6 ? (a / 1e6).toFixed(6) : a,
          dots = Object.values(grid).reduce((p, c) => p + c.length, 0)) {
          return {
            err: dots - Object.keys(grid).length, ms: +(performance.now() - T).toFixed(3), B: ts(O),
            lg: Math.log(_max) | 0, len: _min.toExponential(2), dot: ts(dots), line: ts(lines.size)
          };
        },
        vb: function (m) { return [mx - m, my - m, Mx - mx + 2 * m, My - my + 2 * m]; },
        put: function (x, y, L) {
          let XY = align(x, y); [x, y] = XY; let xy = `${x},${y}`;
          if (L) {
            const l = pxy < xy ? `${pxy},${xy}` : `${xy},${pxy}`;
            if (!lines.has(l)) {
              lines.add(l);
              if (pxy !== dxy) { d += `M${oo(pxy)}`; }
              d += ` ${oo(dxy = xy)}`;
              mx = Math.min(x, px, mx); Mx = Math.max(x, px, Mx);
              my = Math.min(y, py, my); My = Math.max(y, py, My);
            }
          }
          pxy = xy; px = x; py = y;
          return XY;
        },
      };
    })();
  let id = 'id' + Math.random().toString(36).slice(2);
  for (i of function* g(n) { if (n > 0) for (j of g(n - 1)) yield* u(n)?.[j] ?? j; else yield* R.S; }(R._n)) ++O &&
    'F' === i || 'f' === i ? [x, y] = D.put(x + f(Math.cos), y + f(Math.sin), 'F' === i) :
    '+' === i ? a += p : '*' === i ? q++ : '|' === i ? b = (b + 2) % 4 :
    '-' === i ? a -= p : '/' === i ? q-- : '^' === i ? b = (b + p + 4) % 4 :
    '!' === i ? p = -p :
    '[' === i ? z.push([x, y, a, b, q]) :
    ']' === i ? z.length && ([x, y, a, b, q] = z.pop(), D.put(x, y)) : 0;
  [x, y, a, b] = D.vb(R._p ?? 2).map(o);
  let P = Number(R._d ?? 1);
  svg ||= C('svg');
  svg.setAttribute('viewBox', `${R._x ?? x} ${R._y ?? y} ${R._w ?? a} ${R._h ?? b}`);
  svg.setAttribute('stroke-opacity', `${R._o ?? 1}`);
  svg.replaceChildren(
    (t => (t.textContent = R?.[''] ?? 'a', t))(C('title')),
    (t => (t.textContent = JSON.stringify({ stat: D.stat(), R }), t))(C('desc')),
    C('rect', { fill: `#${R._cb ?? 'fff'}`, x, y, width: a, height: b }),
    C('defs', 0, C('marker', {
      id,
      /*markerUnits:'userSpaceOnUse',*/
      markerWidth: 2 * P,
      markerHeight: 2 * P,
      //viewBox: '-1 -1 2 2',
      viewBox: `${-P} ${-P} ${2 * P} ${2 * P}`,
    }, C('circle', {
      r: 1,
      fill: '#' + (R._cd ? R._cd : '000'),
      style: R._r ? `filter:blur(${R._r}px)` : ''
    }))),
    C('path', {
      stroke: '#' + (R._cs ? R._cs : '000'),
      'stroke-width': R._s ?? 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      fill: 'none',
      ...R._d && ['start', 'mid', 'end'].reduce((p, c) => (p['marker-' + c] = `url(#${id})`, p), {}),
      d
    }),
  );
  return svg;
}