import { strings } from './editor.strings.js';
import { lsystemSvg } from './lsystemSvg.js';
import { examples } from './examples.js';
import { wrappedRun, yieldOnce, toggleCustomLog } from './utils.js';
import { getRules, adddefs, stringify } from './ruletext.js';
import { addSvgZoom, downloadPng, downloadSvg } from './svgutils.js';

async function clickDownloadPng() {
    try {
        const { w, h, s, filename } = await downloadPng(getSvg());
        console.log(`saved: ${w}x${h} ${s} bytes ${filename}`);
    } catch (e) {
        message(e.message);
    }
}

function clickSubmit() { state.ac ? state.ac.abort() : update(getRules(getText())); }
function getText() { return el.textarea.innerText; }
function getSvg() { return el.bigsvg.children[0]; }
function clickReset() { localstorageReset(); location.reload(); }
function show(e) { [el.message, el.bigsvg, el.smallsvgs].forEach(i => i.classList.toggle('hidden', e !== i)); }
function setText(rR) {el.textarea.innerHTML = stringify(rR, 1);}
function getDot() {return el.buttondot.hasAttribute('data-checked');}
function setDot(enabled) {el.buttondot.toggleAttribute('data-checked', enabled);}
function updateFromLocation(a = location.href.split(/[?#]/)[1]) {return a && (update(a), 1);}

async function message(m, delay = 0, short = '') {
    clearTimeout(state.timer);
    el.buttonminilog.textContent = short;
    const f = async () => show(Object.assign(el.message, { innerText: m }));
    if (delay)
        state.timer = setTimeout(f, delay);
    else
        await f();
}

async function update(rules) {
    try {
        if (rules) {
            rules = typeof rules === 'string' ? getRules(rules) : rules;
            setText(rules);
        } else {
            rules = getRules(getText());
        }
        const R = createR(rules);
        if (getDot() && !R._k) R._k = 1;
        el.buttonsubmit.toggleAttribute('data-checked', 1);
        const svg = await lsystemSvgWrap(R, true);
        clearTimeout(state.timer);
        el.buttonsubmit.toggleAttribute('data-checked', 0);
        const tit = svg.querySelector('title')?.textContent;
        if (!svg) return;
        if (!tit?.startsWith(state.interrupted)) localstorageSave('R', rules);
        else console.log(tit);
        const stat = JSON.parse(svg.querySelector('desc').textContent).stat;
        console.log(Object.entries(stat).map(([k, v]) => v + ' ' + k).join(' '));
        const t = stat.ms < 1000 ? ~~stat.ms + ' ms' : (stat.ms / 1e3).toPrecision(2) + ' s';
        el.buttonminilog.innerHTML = stat.err ? stat.err + ' error<br>' : '' + t;
        el.bigsvg.replaceChildren(svg);
        addSvgZoom(svg, '#bigsvg');
        show(el.bigsvg);
    } catch (e) {
        message(e.message, 0, strings.errors.e);
    }
}

async function lsystemSvgWrap(R, isInterruptable) {
    const acHolder = isInterruptable ? state : undefined;
    const progress = isInterruptable ? n => message('Processing...', 0, (n / 1e6).toFixed(1) + ' M') : undefined;
    return wrappedRun(acHolder, progress, lsystemSvg, R);
}

function openStandaloneSvg(R = getRules(getText())) {
    Object.assign(
        document.createElement('a'), {
        target: '_blank',
        href: `lsystem.svg#${stringify(createR(R, 1))}`,
    }).click();
}

function ael(elOrQS, listener) {
    const el = typeof elOrQS === 'string' ? document.querySelector(elOrQS) : elOrQS;
    const typ = el.classList.contains('altclick') ? 'altclick' : 'click';
    if (typ === 'altclick') {
        const alternative = (e, i) => listener(i || e.shiftKey || e.type === 'pointerdown');
        el.addEventListener('click', alternative, { passive: true });
        let isLongTap = false;
        const suppressPostLongClick = e => { if (isLongTap) { isLongTap = false; e.stopPropagation(); e.preventDefault(); } };
        el.addEventListener('click', suppressPostLongClick, { capture: true, passive: false });
        let longTapTimer = null;
        let startX = 0, startY = 0;
        const MOVE_THRESHOLD = 10;
        const startLongTap = e => {
            if (e.button && e.button !== 0) return;
            isLongTap = false;
            el.classList.add('long-tap-progress');
            try { el.focus && el.focus({ preventScroll: true }); } catch (err) { el.focus && el.focus(); }
            const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
            startX = t.pageX; startY = t.pageY;
            longTapTimer = setTimeout(() => {
                isLongTap = true;
                alternative(e, -1);
                el.classList.remove('long-tap-progress');
            }, 500);
        };
        const cancelLongTap = () => {
            if (longTapTimer) { clearTimeout(longTapTimer); longTapTimer = null; }
            el.classList.remove('long-tap-progress');
        };
        const handlePointerMove = e => {
            if (!longTapTimer) return;
            const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e;
            const dx = t.pageX - startX, dy = t.pageY - startY;
            if (Math.hypot(dx, dy) > MOVE_THRESHOLD) cancelLongTap();
        };
        el.addEventListener('pointerdown', startLongTap, { passive: false });
        el.addEventListener('pointerup', cancelLongTap, { passive: true });
        el.addEventListener('pointermove', handlePointerMove, { passive: true });
        el.addEventListener('pointercancel', cancelLongTap, { passive: true });
        el.addEventListener('pointerleave', cancelLongTap, { passive: true });
    } else {
        el.addEventListener(typ, listener, { passive: true });
    }
}

function clickNpp(i) {
    const R = getRules(getText());
    R._n = Math.max(0, Math.min(9, (i ? 1 : -1) + parseInt(R._n ?? 0)));
    setText(R);
    update();
}

function getViewBox(force = 0) {
    const svg = el.right.querySelector('svg');
    if (!svg) return {};
    const v = svg.getAttribute('viewBox')?.split(' ') || [];
    return v.length && (force ||
        ['x', 'y', 'width', 'height'].map(attr => svg.querySelector('rect')?.getAttribute(attr)).join(' ') !== v.join(' ')
    )
        ? { _x: v[0], _y: v[1], _w: v[2], _h: v[3] }
        : {};
}

function createR(o, preserveViewBox) {
    const R = typeof o === 'string' ? getRules(o) : o;
    if (!preserveViewBox) return R;
    return { ...R, ...getViewBox() };
}

function localstorageSave(s, o) {
    function set(k, v) { (!s || s === k) && localStorage.setItem('lsystem_' + k, v); }
    try { set('R', stringify(o || getText())); } catch (e) { return; }
    set('export', el.buttonexport.getAttribute('data-checked') === null);
    set('minilog', el.buttonminilog.getAttribute('data-checked') === null);
}

function localstorageReset() {
    ['export', 'minilog', 'R']
        .forEach(k => localStorage.removeItem('lsystem_' + k));
}

async function generateAllExamples(container) {
    const t0 = performance.now();
    const decN = eg => ({
        ...eg, ...{
            _n: Math.max(2, parseInt(eg._n) - 1, 1),
            _k: eg._k ? eg._k : getDot() ? 1 : '',
            _cc: eg._cc ? eg._cc : getDot() ? '#0000' : '#000',
            _cb: eg._cb ? eg._cb : el.buttontpbg.hasAttribute('data-checked') ? '#0000' : '',
        }
    });
    const ael = r => {
        (r.el).addEventListener('click', e => e.ctrlKey
            ? openStandaloneSvg(state.eg.a[state.eg.i = r.i])
            : showExample(state.eg.i = r.i)
        );
        return r.el;
    };
    /*/ // object: slow!
    const svg2object = svg => Object.assign(document.createElement('object'), { data: URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })) });
    const eg2el = async (eg, i) => ({ el: svg2object(await lsystemSvgWrap(createR(decN(eg)))), i });
    /*/
    const eg2el = async (eg, i) => ({ el: await lsystemSvgWrap(createR(decN(eg))), i });
    /**/
    /*/ // simultaneously:first-slow overall-fast, separately:firstfast-intheory but still displays one go, object not but that horribly slow
    container.replaceChildren(...(await Promise.all(state.eg.a.map(eg2el))).map(ael));
    /*/
    container.replaceChildren();
    state.eg.a.forEach(async (eg, i) => container.appendChild(await ael(await eg2el(eg, i))));
    await yieldOnce();
    /**/
    const overall = ((performance.now() - t0)).toFixed(0);
    const arr = [...container.querySelectorAll('svg')].map(a => JSON.parse(a.querySelector('desc').textContent).stat.ms);
    const sum = arr.reduce((p, c) => p + parseFloat(c), 0) | 0;
    const max = Math.max(...arr);
    const maxIdx = arr.indexOf(max);
    console.log(`[${state.eg.a.length} examples ${overall}ms ?${overall - sum}ms ${max}@${maxIdx + 1}]`);
}

function showExample(i = state.eg.i, l = state.eg.a.length) {
    i = state.eg.i = (i + l) % l;
    update(state.eg.a[i]);
    console.log(`[example: ${i + 1} / ${l}]`);
}

function toggleTpbg() {
    const s = el.buttontpbg.toggleAttribute('data-checked');
    el.right.classList.toggle('tpbg', s);
    if (!getText()) return showExamples();
    const R = getRules(getText());
    s ? (R._cb = '#0000') : (delete R._cb, 0);
    setText(R);
    update();
}

function toggleDot() {
    setDot(!getDot());
    getText() ? (setText({ ...getRules(getText()), _k: getDot() ? 1 : 0, _cc: getDot() ? '#0000' : '' }), update()) : showExamples();
}

function toggleCursive(alt) {
    if (alt) {
        const s = document.body.classList.toggle('cursive');
        document.body.classList.toggle('cursive', s)
        el.buttoncursive.toggleAttribute('data-checked', s);
    } else if (getText()) {
        const R = getRules(getText());
        setText({ ...R, _hand: +R._hand === 1 ? '' : 1 });
        update();
    } else {
        showExamples();
    }
}
function toggleExport(s = el.buttonexport.getAttribute('data-checked') === null) {
    el.buttonexport.toggleAttribute('data-checked', s);
    document.querySelectorAll('.export').forEach(e => e.classList.toggle('hidden', !s));
    localstorageSave('export');
}
function toggleMinilog(s = el.buttonminilog.getAttribute('data-checked') === null) {
    el.buttonminilog.toggleAttribute('data-checked', s);
    el.buttonlog.classList.toggle('hidden', !s);
    localstorageSave('minilog');
}
function toggleMobile(e) {
    state.isMobileForce = state.isMobileForce ? 3 - state.isMobileForce : isMobile() ? 2 : 1;
    el.buttoncursive.textContent = isMobile() ? 'mobile' : 'desktop';
    document.body.classList.toggle('keyboard-active', !isMobile());
    init();
}

async function showExamples() {
    setText('');
    show(el.smallsvgs);
    return generateAllExamples(el.smallsvgs);
}

function nextExample(i) {
    i = (state.eg.i + (i ? -1 : 1)) % state.eg.a.length;
    i = (i + state.eg.a.length) % state.eg.a.length;
    showExample(i);
}

function isMobile() { return [state.isMobileInitial, 1, 0][state.isAutoMobileDesktop]; }

function setupConsts() {
    Object.assign(el, Object.fromEntries([...document.querySelectorAll('[id]')].map(e => [e.id, e])));
    Object.assign(state, {
        abortController: null,
        interrupted: 'interrupted-',
        eg: {
            i: 0,
            a: (typeof examples !== 'undefined' ? examples : ['S=f+f-fSF+FSF,_n=4']).map(s =>
                getRules(typeof s === 'string' ? s : stringify(s))
            ).filter(s => s),
        },
        divider: {
            isActive: false,
            active: null,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
        },
        isAutoMobileDesktop: 0,
        isMobileInitial: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            typeof window.orientation !== 'undefined' ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 1),
        lastViewportHeight: window.visualViewport ? window.visualViewport.height : window.innerHeight,
        CNT: 0,
    });
    el.textarea.dataset.placeholder = strings.textarea.placeholder;
}

//function setupDataurls() { [...document.querySelectorAll('[data-r]')].forEach(e => e.data = datasvg + '#' + e.getAttribute('data-r')); }

function setupCustomLog() {
    toggleCustomLog(true, (...args) => {
        if (el.buttonlog) {
            console.oldLog(...args);
            el.buttonlog.replaceChildren(
                args.flatMap(a => a && 'object' == typeof a ? Object.entries(a) : [['', a]])
                    .map(([k, v]) => `${k}${k && ' '}${String(v).replace(/-/g, '‑').replace(/Infinity/g, '-')}`)
                    .join('\n')
                , document.createElement('br')
                , ...[...el.buttonlog.childNodes].slice(0, 9)
            );
        } else { console.oldLog(...args); }
    });
}

function setupDividers() {
    el.divider1.addEventListener('pointerdown', e => {
        if (isMobile() && e.target === el.divider1) return;
        state.divider.isActive = true;
        state.divider.active = e.target;
        state.divider.startX = e.clientX;
        state.divider.startY = e.clientY;
        state.divider.startWidth = el.left.offsetWidth;
        state.divider.startHeight = el.textarea.offsetHeight;
    }, { passive: true });
    window.addEventListener('pointerup', () => {
        state.divider.isActive = false;
        state.divider.active = null;
    }, { passive: true });
    window.addEventListener('pointermove', e => {
        if (!state.divider.isActive || !state.divider.active) return;
        if (state.divider.active === el.divider1 && !isMobile()) {
            const deltaX = e.clientX - state.divider.startX;
            const newWidth = state.divider.startWidth + deltaX;
            el.left.style.width = `${Math.min(Math.max(newWidth, 50), window.innerWidth - 50)}px`;
        }
    }, { passive: true });
}

function setupMobileKeyboard() {
    if (!isMobile()) return;
    const updateRightSize = () => {
        if (document.body.classList.contains('keyboard-active') && window.visualViewport) {
            el.right.style.height = `${window.visualViewport.height}px`;
        } else {
            el.right.style.height = 'auto';
        }
    };
    el.textarea.addEventListener('focus', () => {
        document.body.classList.add('keyboard-active');
        updateRightSize();
    });
    el.textarea.addEventListener('blur', () => {
        document.body.classList.remove('keyboard-active');
        el.right.style.height = 'auto';
        el.left.style.background = 'transparent';
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            if (Math.abs(window.visualViewport.height - state.lastViewportHeight) > 50) {
                document.body.classList.toggle('keyboard-active', window.visualViewport.height < state.lastViewportHeight);
                updateRightSize();
                state.lastViewportHeight = window.visualViewport.height;
            }
        });
    }
}

function setupEventListeners() {
    window.addEventListener('hashchange', updateFromLocation);
    document.addEventListener('keydown', e => e.key === 'Shift' && document.body.classList.add('shift-pressed'));
    document.addEventListener('keyup', e => e.key === 'Shift' && document.body.classList.remove('shift-pressed'));
    el.textarea.addEventListener('keydown', e => e.ctrlKey && e.key === 'Enter' && clickSubmit());
    el.textarea.addEventListener('input', () => update());
    el.textarea.addEventListener('blur', () => el.textarea.textContent === '' && (el.textarea.textContent = ''));
    el.textarea.addEventListener('paste0', e => {
        e.preventDefault(); const text = e.clipboardData.getData('text/plain');
        // deprecated but it has features: ctrl+z, leaves cursor in place, better htmlAsPlaintext, newline
        document.execCommand('insertText', false, text);
        clickSubmit();
    });
    el.textarea.addEventListener('keydown', e => e.ctrlKey && e.key === 'c'
        && !window.getSelection().toString().length && (
            e.preventDefault(),
            navigator.clipboard.writeText(stringify(getText())),
            console.log(strings.copied)
        )
    );
    ael(el.buttonsubmit, clickSubmit);
    ael(el.buttonreset, clickReset);
    ael(el.buttonnpp, clickNpp);
    ael(el.buttoncursive, toggleCursive);
    ael(el.buttonnexteg, nextExample);
    ael(el.buttondefs, adddefs);
    ael(el.buttonalleg, showExamples);
    ael(el.buttondot, toggleDot);
    ael(el.buttontpbg, toggleTpbg);
    ael(el.buttonjs, () => openStandaloneSvg());
    ael(el.buttonsvg, () => downloadSvg(getSvg()));
    ael(el.buttonpng, clickDownloadPng);
    ael(el.buttonjson, () => (navigator.clipboard.writeText(JSON.stringify(getRules(getText()))), console.log(strings.copied)));
    ael(el.buttonline, () => (navigator.clipboard.writeText(stringify(getText())), console.log(strings.copied)));
    ael(el.buttonlines, () => (navigator.clipboard.writeText(stringify(getText()).replace(/,/g, '\n')), console.log(strings.copied)));
    ael(el.buttonexport, () => toggleExport());
    ael(el.buttonminilog, () => toggleMinilog());
}

async function updateFromLocalStorage() {
    function get(k) { return localStorage.getItem('lsystem_' + k); }
    toggleExport(get('export') === 'false');
    toggleMinilog(get('minilog') === 'false');
    const r = get('R');
    if (r && r !== '' && r !== '{}') {
        await update(r);
    } else {
        await showExamples();
    }
}

function init() {
    setupConsts();
    // setupDataurls();
    setupCustomLog();
    setupDividers();
    setupMobileKeyboard();
    setupEventListeners();
    updateFromLocation() || updateFromLocalStorage();
    el.textarea.setAttribute('contenteditable', true);
}

/* end of fun */

const el = {}, state = {};
document.addEventListener('DOMContentLoaded', init);
