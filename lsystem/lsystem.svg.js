function createStep(d, E = 1, C = 2 * E) {
  let lp = '0,0', LL, lines = new Set(), grid = {};
  let _min = 1 / 0, _max = -1 / 0, _all = 0, _cmp = 0, mx = _min, Mx = _max, my = _min, My = _max, [lx, ly] = align(0, 0);
  function align(X, Y) {
    let ps, p, d, i, j, k,
      D = Infinity, P = null,
      x = Math.floor(X / C),
      y = Math.floor(Y / C),
      e = Math.ceil(E / C);
    for (j = -e; j <= e; j++) for (i = -e; i <= e; i++) {
      ps = grid[`${x + i},${y + j}`];
      if (ps) for (k = 0; k < ps.length; k++) {
        p = ps[k];
        d = Math.hypot(p[0] - X, p[1] - Y);
        if (d < D) { D = d; P = p; }
        _cmp++; _max < d && d < E && (_max = d); E < d && d < _min && (_min = d);
      }
    } _all++;
    if (D >= E) (grid[`${x},${y}`] ??= []).push(P = [X, Y]);
    return P;
  }
  return {
    stat: function () {
      return {
        _min, _max, _Mpm: _max / _min, _all, _cmp,
        keys: Object.keys(grid).length,
        vals: Object.values(grid).reduce((p, c) => p + c.length, 0),
        line: lines.size
      };
    },
    vb: function (m) { return [mx - m, my - m, Mx - mx + 2 * m, My - my + 2 * m]; },
    put: function (x, y, L) {
      let XY = align(x, y);[x, y] = XY; let p = `${x},${y}`;
      if (L) {
        const l = lp < p ? `${lp} ${p}` : `${p} ${lp}`;
        if (!lines.has(l)) {
          lines.add(l);
          if (!LL || lp !== p) { d(`\nM${lp}`); LL = true; }
          d(` ${p}`);
          mx = Math.min(x, lx, mx);
          Mx = Math.max(x, lx, Mx);
          my = Math.min(y, ly, my);
          My = Math.max(y, ly, My);
        }
      } else { LL = false; }
      lp = p; lx = x; ly = y;
      return XY;
    },
  };
}
function createSvg(R = 'S=AX,=title,A=[+AX-AX-AX]-AX+AX+AX-,F=,X=F+F+F+FFF-F-F-F,_a=60,_n=3', dot, Z) {
  let r = a => 'string' === typeof a ? JSON.parse(`{${a.replace(/&/g, ',').replace(/([^,=]*)=([^,=]*)/g, '"$1":"$2"')}}`) : a
    , [x, y, a, b, q] = Array(8).fill(0), d = '', p = 1, i, j, Q = Math.PI / 2;
  [R, Z] = Array.isArray(R) ? R : [r(R), r(Z)]; R.S ??= 'F'; R._a = R._a ?? 90; R._n ??= 1; R._l ??= 9; R._m ??= Q
  const z = [], step = createStep(p => d += p), u = n => Z && n === R._n ? Z : R, B = R._a / 90
    , c = (t, a, ...b) => {
      let e = document.createElementNS('http://www.w3.org/2000/svg', t);
      for (i in a) e.setAttribute(i, a[i]);
      b?.map(b => e.prepend(b));
      return e;
    }, f = f => R._l * Math.pow(R._m, q) * f(Q * (a * B + b));
  for (i of function* g(n) { if (n) for (j of g(n - 1)) yield* u(n)?.[j] ?? j; else yield* R.S; }(R._n))
    'F' === i || 'f' === i ? [x, y] = step.put(x + f(Math.cos), y + f(Math.sin), 'F' === i) :
    '+' === i ? a += p : '*' === i ? q++ : '|' === i ? b = (b + 2) % 4 :
    '-' === i ? a -= p : '/' === i ? q-- : '^' === i ? b = (b + p + 4) % 4 :
    '!' === i ? p = -p :
    '[' === i ? z.push([x, y, a, b, q]) :
    ']' === i ? ([x, y, a, b, q] = z.pop(), step.put(x, y)) : 0;
  [x, y, a, b] = step.vb(2);
  try { console.log({ ...step.stat(), ...R, RZ: Z }); } catch (e) { }
  return c('svg', { viewBox: `${x} ${y} ${a} ${b}` },
    c('path', { stroke: dot?'none':'#000', d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      ...(dot && ['start', 'mid', 'end'].reduce((p, c) => (p['marker-' + c] = 'url(#m)', p), {}) || {}) }),
    c('defs', 0, c('marker', { id: 'm', viewBox: '-3 -3 6 6' }, c('circle', { r: 1, fill: '#000' }))),
    c('rect', { fill: '#fff', x, y, width: a, height: b }),
    (t => (t.textContent = R[''], t))(c('title'))
  );
}