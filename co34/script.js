let ver = 'v2';
const numOfPieces = 5;
const N = 7;
const animTime = 100;
const vibrate = false && 'vibrate' in navigator;

let rnd;
const rndName2alias = { rnd0: 'Mat', rnd1: 'Cry', rnd2: 'Zed', '': 'Psi' };
const alias2rndName = Object.fromEntries(Object.entries(rndName2alias).map(([k, v]) => [v, k]));
const rnd3 = ((a, seed = 0) => (n, i = seed) => ((seed = i) < a.length ? a[seed++] % n + n : seed++) % n)([
    -2, -1, 3, 4, 0, 2, 3
]);
const rnd2 = () => 0;
const rnds = [rnd0, rnd1, rnd2, rnd3];
const newRnd = (r = -1) => rnd = rnds[r === -1 ? (rnd1(2) ^ rnd0(2)) : r];
const getRndAlias = () => rndName2alias[rnd.name];

const TYP_EMPTY = 0;
const TYP_OUT = -1;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
let squares, getTyp;
$(main);

function rnd0(n) { return Math.random() * n | 0; }
function rnd1(n) {
    const uint16s = Math.ceil(Math.log2(n) / 16);
    const cutoff = Math.floor((65536 ** uint16s) / n) * n;
    const buffer = new Uint16Array(uint16s);
    let r;
    while (cutoff <= (r = crypto.getRandomValues(buffer).reduce((p, c, i) => p + c * 65536 ** i, 0)));
    return r % n;
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
}
function countHV() {
    let h = 0, v = 0, ha = [], va = [];
    function isEmpty(x, y) { return TYP_EMPTY === getTyp(x, y); }
    for (const [k, j] of seq(N, N - 1)) {
        if (isEmpty(j, k) && isEmpty(j + 1, k)) { h++; ha.push(xy(j, k)); }
        if (isEmpty(k, j) && isEmpty(k, j + 1)) { v++; va.push(xy(k, j)); }
    }
    return { h, hv: h + v };
}

function addPiece() {
    $('#piece').css({ top: 0, left: 0 });

    const { h, hv } = countHV();
    $('#hv').html(hv);
    if (hv === 0) { return gameover(); }

    const isHorizontal = rnd(hv) < h;
    const first = 1 + rnd(numOfPieces);
    const second = 1 + rnd(numOfPieces);

    $('#piece').removeClass().addClass(isHorizontal ? 'horizontal' : 'vertical');
    $('.first').attr('data-typ', first);
    $('.second').attr('data-typ', second);

    save();
}

function save() { localStorage.setItem('html', $('.container').html()); }

function gameover() {
    $('#ver').html(`${getRndAlias()}`);
    $('#pieces').addClass('hidden');
    $('#gameover').removeClass('hidden');
    $('#gameover>button').text(getRndAlias());
    save();
}

function restart() {
    $('#xye').html(0);
    $('#xylog').html('');
    $('#score').html(0);
    $('#board > div').attr('data-typ', TYP_EMPTY);
    addPiece();
    $('#pieces').removeClass('hidden');
    $('#gameover').addClass('hidden');
    save(); load();
}

function hand2board() {
    if ($('.highlight').length < 1) {
        $('#piece').animate({ top: 0, left: 0 }, animTime);
        return false;
    }
    const fooIdx = $('.highlight').first().index();
    const barIdx = $('.highlight').last().index();
    let fooTyp = $('.first').attr('data-typ');
    let barTyp = $('.second').attr('data-typ');
    if ($('.vertical').length) { [barTyp, fooTyp] = [fooTyp, barTyp]; }

    setTyp(fooIdx, fooTyp);
    setTyp(barIdx, barTyp);
    getTyp = memoize(getTypDOM);
    $('#xylog').html(`${$('#xylog').html()},${fooTyp}_${fooIdx},${barTyp}_${barIdx}`); // _stat0
    $('.highlight').removeClass('highlight');

    vibrate && navigator.vibrate(20);
    return true;
}

function xy(x, y) { if (Array.isArray(x)) [x, y] = x; return typeof y === 'undefined' ? [x % N, x / N | 0] : x + y * N; }
function getHover() { return squares.findIndex(s => s.classList.contains('ui-droppable-hover')); }
function setHighlight(i) { return squares[i].classList.add('highlight'); }
function setTyp(i, typ) { return squares[i].setAttribute('data-typ', typ); }
function getTypDOM(ix, y) {
    if (Array.isArray(ix)) [ix, y] = ix;
    if (typeof y === 'undefined') {
        return parseInt(squares[ix].getAttribute('data-typ'));
    } else if (ix < 0 || y < 0 || ix >= N || y >= N) {
        return TYP_OUT;
    } else {
        return getTypDOM(xy(ix, y));
    }
}

function memoize(f, join = a => a.join(',')) {
    const m = new Map();
    return (...a) => (k => (m.has(k) ? m : m.set(k, f(...a))).get(k))(join(a));
}

function* seq(X, Y) { for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) yield [x, y]; }

function getClearables() {
    const set = new Set();
    for (const [x, y] of seq(N, N)) {
        const typ = getTyp(x, y);
        if (typ === TYP_EMPTY) { continue; }
        function checkTyp(r) { r[0] += x; r[1] += y; return getTyp(r) === typ; }
        function checkSeq(...a) { a.every(checkTyp) && [[x, y], ...a].forEach(r => set.add(xy(r))); }
        x < N - 2 /*              */ && checkSeq([1, 0], [2, 0]);
        y < N - 2 /*              */ && checkSeq([0, 1], [0, 2]);
        x < N - 3 && y < N - 3 /* */ && checkSeq([1, 1], [2, 2], [3, 3]);
        x < N - 3 && y > 2 /*     */ && checkSeq([1, -1], [2, -2], [3, -3]);
    }
    return set;
}
function drag() {
    $('.highlight').removeClass('highlight');
    const idx = getHover();
    const isHorizontal = $('#piece').hasClass('horizontal');
    function isEmpty(x, y) { return TYP_EMPTY === getTyp(x, y); }
    function isEmptyPair(x, y, isHorizontal) { return isEmpty(x, y) && (isHorizontal ? isEmpty(x + 1, y) : isEmpty(x, y - 1)); }
    if (idx !== -1 && isEmptyPair(...xy(idx), isHorizontal)) {
        setHighlight(idx);
        setHighlight(isHorizontal ? idx + 1 : idx - N);
    }
}
function drop() {
    try {
        if (!hand2board()) { return; }
        const clearables = getClearables();
        clearables.forEach(i => setTyp(i, TYP_EMPTY));
        getTyp = memoize(getTypDOM);
        updateScore(clearables.size);
        addPiece();
        save();
    } catch (e) { download(e, 'error.txt'); }
}
function updateScore(cleared) {
    if (cleared === 0) {
        $('#xyd').html(1);
        return;
    }
    const streak = Number($('#xyd').html());
    const score = Number($('#xye').html());
    const best = Number($('#xyc').html());
    const add = cleared * streak;
    const newscore = score + add;

    if (newscore > best) {
        $('#xyc').html(newscore);
        // $('#best').html(newscore);
    }

    $('#score').html(newscore);
    $('#xye').html(newscore);
    $('#xyd').html(streak + 1);
}

function init() {
    /**/const dataTyps = Array.from({ length: numOfPieces + 1 }, (_, i) =>
    `[data-typ="${i}"] {background-position: ${(i ? (i - 1) / (numOfPieces - 1) : -1) * 100}%;}`
);/*/
    const dataTyps = Array.from({ length: numOfPieces + 1 }, (_, i) =>
        `[data-typ="${i}"] {background-color: ${i ? `hwb(calc(${(i-1) * 72} + var(--o)) 0 0)` : `#0000`};}`
    );/**/

    $('<style>').html(`
#board > div { width: calc(100% / ${N});}
[data-typ] { --o: 66; }
#piece { width: calc(100% / ${N} + 4px); }
.horizontal { margin-left: calc(-100% / ${N} - 4px); }
${dataTyps.join('\n')}
`   ).appendTo('head');

    $('#board').append(`<div data-typ="${TYP_EMPTY}"></div>`.repeat(N * N));
    window.addEventListener('scroll', () => window.scrollTo(0, 0));
    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
    /* $(document).on('click', '.togglemodal', () => $('.modal').toggleClass('hidden')); */
    document.addEventListener('mouseup', () => {
        const s = document.body.style, o = s.backgroundColor;
        s.backgroundColor = '#f00';
        setTimeout(() => s.backgroundColor = o, 50);
    });
}

function download(s, f) {
    const blob = new Blob([s], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = f;
    a.click();
    URL.revokeObjectURL(url);
}
// function copy2clipboard(s) {navigator.clipboard.writeText(s).then().catch();}

function downloadHtml() {
    function ts(n) { return new Intl.NumberFormat().format(n); }
    const s = $('.container').html(), r = getRndAlias(), f = `c3.${new Date().toISOString().replace(/(-|:|\..*)/g, '')}.${r}.html`;
    // copy2clipboard(s);
    download(s, f);
    alert(`${r} \n ${ts(s.length)} \n ${f}`);
}

function load() {
    const html = localStorage.getItem('html');
    if (html) {
        $('.container').html(html);
        $('#points').hide();
    }

    const r = $('#ver').attr('data-rnd');
    newRnd(rnds.findIndex(e => e.name === alias2rndName[r]));
    $('#ver').attr('data-rnd', getRndAlias()); save();

    $('#score').attr('title', 'load');
    $('#score').on('click', () => {
        typeof constsaved !== 'undefined' && localStorage.setItem('html', constsaved);
        load();
    });
    $('#hv').attr('title', 'download');
    $('#hv').on('click', () => {
        downloadHtml();
    });
    $('#ver').attr('title', 'wtr');
    $('#ver').on('click', () => {
        $('#ver').html(`${getRndAlias()}`);
    });

    $('#piece').draggable({
        distance: 0,
        revert: dropTarget => !dropTarget,
        ...(isMobile && { cursorAt: { top: 210 } }),
        drag: drag,
        revertDuration: 2 * animTime
    });

    squares = $('#board > div').toArray();
    $('#board > div').droppable({
        accept: '#piece',
        drop: drop,
    });

    $('.container').removeClass('hidden');
    getTyp = memoize(getTypDOM);
    updateDone(ver);
}

function updateWillbe(newWorker) {
    const div = document.createElement('div');
    div.textContent = `Updating ${ver} to `;
    div.addEventListener('click', () => newWorker.postMessage({ action: 'skipWaiting' }));
    document.querySelector('.flex').replaceChildren(div);
};

function updateDone(newVer) {
    $('#ver').html((ver = newVer).slice(4, 8));
}

function updates(beforestart, finish) {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('./sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () =>
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller &&
                beforestart(newWorker)
            );
        });
    }).catch(e => download(e, 'error.txt'));
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
    const uuid = crypto.randomUUID();
    const mainChan = new BroadcastChannel("chClient");
    mainChan.postMessage({
        ver: "ver",
        respondAt: uuid
    });
    const respChan = new BroadcastChannel(uuid);
    respChan.onmessage = ({ data }) => {
        finish(data);
        respChan.close();
        mainChan.close();
    };
}

function main() {
    init();
    load();
    updates(updateWillbe, updateDone);
}
