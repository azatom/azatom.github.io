async function createSvg(R = 'S=AX,=title,A=[+AX-AX-AX]-AX+AX+AX-,F=,X=F+F+F+FFF-F-F-F,_a=60,_n=3', svg) {
  R = 'string' === typeof R ? Object.fromEntries(R.replace(/&/g, ',').replace(/([^,:=]*)[:=]([^,:=]*)/g, '$1=$2').split(',').map(a => a.split('='))) : R;
  let T = performance.now(), [x, y, a, b, q, O] = Array(9).fill(0), d = '', p = 1, i, j, Q = Math.PI / 2;
  R.S ??= 'F'; R._a = R._a ?? 90; R._n ??= 1; R._l ??= 9; R._m ??= Q;
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
    }, D = ((E = 1, F = 9 * E) => {
      let lp = '0,0', LL, lines = new Set(), grid = {}, [lx, ly] = align(0, 0), mx = 1 / 0, Mx = -1 / 0, my = mx, My = Mx;
      let _min = mx, _max = Mx, _cmp = 0;
      function oo(s) { return s.split(',').map(o).join(','); }
      function align(X, Y) {
        let D = Infinity, P, ps, p, d, i, j, k, x = Math.floor(X / F), y = Math.floor(Y / F), e = Math.ceil(E / F);
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
        stat: function (ts = a => a >= 1e6 ? (a / 1e6).toFixed(6) : a, d = Object.values(grid).reduce((p, c) => p + c.length, 0)) {
          return {
            err: d - Object.keys(grid).length, ms: (performance.now() - T /*| 0*/), B: ts(O),
            lg: Math.log(_max) | 0, len: _min.toExponential(2), dot: ts(d), line: ts(lines.size)
          };
        },
        vb: function (m) { return [mx - m, my - m, Mx - mx + 2 * m, My - my + 2 * m]; },
        put: function (x, y, L) {
          let XY = align(x, y);[x, y] = XY; let p = `${x},${y}`;
          if (L) {
            const l = lp < p ? `${lp} ${p}` : `${p} ${lp}`;
            if (!lines.has(l)) {
              lines.add(l);
              if (!LL || lp !== p) { d += `M${oo(lp)}`; LL = true; }
              d += ` ${oo(p)}`;
              mx = Math.min(x, lx, mx); Mx = Math.max(x, lx, Mx); my = Math.min(y, ly, my); My = Math.max(y, ly, My);
            }
          } else { LL = false; }
          lp = p; lx = x; ly = y;
          return XY;
        },
      };
    })(1e-4);
  for (i of function* g(n) { if (n > 0) for (j of g(n - 1)) yield* u(n)?.[j] ?? j; else yield* R.S; }(R._n)) ++O &&
    'F' === i || 'f' === i ? [x, y] = D.put(x + f(Math.cos), y + f(Math.sin), 'F' === i) :
    '+' === i ? a += p : '*' === i ? q++ : '|' === i ? b = (b + 2) % 4 :
      '-' === i ? a -= p : '/' === i ? q-- : '^' === i ? b = (b + p + 4) % 4 :
        '!' === i ? p = -p :
          '[' === i ? z.push([x, y, a, b, q]) :
            ']' === i ? z.length && ([x, y, a, b, q] = z.pop(), D.put(x, y)) : 0;
  [x, y, a, b] = D.vb(R._P ?? 2).map(o);
  svg ||= C('svg');
  svg.setAttribute('viewBox', `${R._x ?? x} ${R._y ?? y} ${R._w ?? a} ${R._h ?? b}`);
  svg.replaceChildren(
    (t => (t.textContent = R?.[''] ?? 'a', t))(C('title')),
    (t => (t.textContent = JSON.stringify({ stat: D.stat(), R: Object.keys(R).sort().map(k => `${k}=${R[k]}`).join(',') }), t))(C('desc')),
    C('rect', { fill: `#${R._b ?? 'fff'}`, x, y, width: a, height: b }),
    C('defs', 0, C('marker', { id: 'm', viewBox: '-3 -3 6 6' }, C('circle', { r: 1, fill: '#000' }))),
    C('path', {
      stroke: R._d == '1' ? 'none' : '#000', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      ...R._d == '1' && ['start', 'mid', 'end'].reduce((p, c) => (p['marker-' + c] = 'url(#m)', p), {}), d
    }),
  );
  return svg;
}