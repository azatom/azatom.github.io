function createSvg(R = 'S=AX&A=[+AX-AX-AX]-AX+AX+AX-&F=&X=F+F+F+FFF-F-F-F&_a=60&_n=3', bg = 0) {
    R = 'string' == typeof R ? JSON.parse('{"' + R.replace(/&/g, '","').replace(/=/g, '":"') + '"}') : R;
    let S = [], Q = Math.PI / 2, T = R._a / 90 || 1
        , [x, y, a, A, mx, Mx, my, My] = Array(8).fill(0), d = 'M0,0', o = 1, l = R._l || 9
        , c = (t, o, e = document.createElementNS('http://www.w3.org/2000/svg', t)) => {
            for (let a in o) e.setAttribute(a, o[a]); return e;};
    for (let q of function* g(n) {
        if (n) for (const p of g(n - 1)) yield* p in R ? R[p] : p; else yield* R.S;
    }(R._n))
        'F' == q || 'f' == q ? (x += l * Math.cos(Q * (a * T + A)),
        mx = x > mx ? mx : x, Mx = x > Mx ? x : Mx,
        y += l * Math.sin(Q * (a * T + A)), my = y > my ? my : y, My = y > My ? y : My,
        d += ('f' == q ? 'M' : 'L') + x + ',' + y) :
        '+' == q ? a += o : '*' == q ? l *= R._m : '!' == q ? o = -o :
        '-' == q ? a -= o : '/' == q ? l /= R._m :
        '|' == q ? A = (A + 2) % 4 : '^' == q ? A = (A + o + 4) % 4 :
        '[' == q ? S.push([x, y, a, A, l]) :
        ']' == q ? ([x, y, a, A, l] = S.pop(), d += 'M' + x + ',' + y) : 0;
    let width = Mx - mx + 2, height = My - my + 2,
    s = c('svg', { viewBox: `${x = mx - 1} ${y = my - 1} ${width} ${height}` });
    bg && s.appendChild(c('rect', {x, y, width, height, fill: '#ffff'}));
    s.appendChild(c('path', {
        d,
        stroke: '#000',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    }));
    return s;
}
