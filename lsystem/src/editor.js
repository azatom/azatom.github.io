import { strings } from './editor.strings.js';
import { lsystemSvg } from './lsystem-svg.js';
import { examples } from './examples.js';
import { wrappedRun, yieldOnce, toggleCustomLog } from './utils.js';
import { getRules, addDefaults, addVb, stringify } from './ruletext.js';
import { addSvgZoom, downloadPng, downloadSvg } from './svgutils.js';

function getText() { return el.textarea.innerText; }
function clickReset() { localstorageReset(); location.reload(); }
function clickSubmit() { state.ac ? state.ac.abort() : update(getRules(getText())); }
function setText(rR) { el.textarea.innerHTML = stringify(rR, 1); }
function clickNpp(alt, R = getRules(getText())) { update(setText(Object.assign(R, { _n: Math.max(0, (alt ? 1 : -1) + +(R._n ?? 0)) }))); }
function getSvg() { return el.bigsvg.children[0]; }
function getDot() { return el.buttondot.hasAttribute('data-checked'); }
function setDot(enabled) { el.buttondot.toggleAttribute('data-checked', enabled); }
function updateFromLocation(a = location.href.split(/[?#]/)[1]) { return a && (update(a), 1); }
function show(e) { [el.message, el.bigsvg, el.smallsvgs, el.readme].forEach(i => i.classList.toggle('hidden', e !== i)); }
function isMobile() { return [state.isMobileInitial, 1, 0][state.isAutoMobileDesktop]; }
function copy(t) { navigator.clipboard.writeText(t); console.log(strings.copied); }

async function message(m, delay = 0, short = '') {
    clearTimeout(state.timer);
    el.buttonminilog.textContent = short;
    const f = async () => show(Object.assign(el.message, { innerText: m }));
    delay ? state.timer = setTimeout(f, delay) : await f();
}

async function lsystemSvgWrap(R, isInterruptable) {
    const acHolder = isInterruptable ? state : undefined;
    const progress = isInterruptable ? n => message('Processing...', 0, (n / 1e6).toFixed(1) + ' M') : undefined;
    return wrappedRun(acHolder, progress, lsystemSvg, R);
}

function createR(o, preserveViewBox) {
    const R = typeof o === 'string' ? getRules(o) : o;
    const vb = preserveViewBox ? getViewBox() : {};
    const dot = getDot() ? {
        _k: R._k ?? 1,
        _cc: R._cc ?? '#0000',
    } : {};
    const tp = el.buttontpbg.hasAttribute('data-checked') ? {
        _cb: R._cb ?? '#0000',
    } : {};
    return { ...R, ...vb, ...dot, ...tp };
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

async function clickDownloadPng() {
    try {
        const { w, h, s, filename } = await downloadPng(getSvg());
        console.log(`saved: ${w}x${h} ${s} bytes ${filename}`);
    } catch (e) {
        message(e.message);
    }
}

function clickOpenStandaloneSvg(R = getRules(getText()), qs = '?') {
    const s = stringify(createR(R, 1));
    const qp = s.replace(/#/g, '%23');
    //const qp = encodeURIComponent(s);
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href: `${strings.lsystemsvg}${qs}${qp}`,
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

function showExample(i = state.eg.i, l = state.eg.a.length) {
    i = state.eg.i = (i + l) % l;
    update(state.eg.a[i]);
    console.log(`[example: ${i + 1} / ${l}]`);
}

function clickNextExample(i) {
    i = (state.eg.i + (i ? -1 : 1)) % state.eg.a.length;
    i = (i + state.eg.a.length) % state.eg.a.length;
    showExample(i);
}

async function clickShowExamples() {
    setText('');
    el.smallsvgs.replaceChildren();
    show(el.smallsvgs);
    const t0 = performance.now();
    const decN = eg => ({
        ...eg,
        _n: Math.max(2, parseInt(eg._n) - 1, 1),
        _k: eg._k ? eg._k : getDot() ? 1 : '',
        _cc: eg._cc ? eg._cc : getDot() ? '#0000' : '#000',
        _cb: eg._cb ? eg._cb : el.buttontpbg.hasAttribute('data-checked') ? '#0000' : '',
    });
    const ael = r => {
        (r.el).addEventListener('click', e => e.ctrlKey
            ? clickOpenStandaloneSvg(state.eg.a[r.i])
            : showExample(r.i)
        );
        return r.el;
    };
    const eg2el = async (eg, i) => ({ el: await lsystemSvgWrap(createR(decN(eg))), i });
    state.eg.a.forEach(async (eg, i) => el.smallsvgs.append(await ael(await eg2el(eg, i))));
    await yieldOnce();
    const overall = ((performance.now() - t0)).toFixed(0);
    const arr = [...el.smallsvgs.querySelectorAll('svg')].map(a => JSON.parse(a.querySelector('desc').textContent).stat.ms);
    const sum = arr.reduce((p, c) => p + parseFloat(c), 0) | 0;
    const max = Math.max(...arr);
    const maxIdx = arr.indexOf(max);
    console.log(`[${state.eg.a.length} examples ${overall}ms ?${overall - sum}ms ${max}@${maxIdx + 1}]`);
}

function toggleTpbg() {
    const s = el.buttontpbg.toggleAttribute('data-checked');
    el.right.classList.toggle('tpbg', s);
    if (!getText()) return clickShowExamples();
    const R = getRules(getText());
    s ? (R._cb = '#0000') : (delete R._cb, 0);
    setText(R);
    update();
}

function toggleDot() {
    setDot(!getDot());
    getText()
        ? update({ ...getRules(getText()), _k: getDot() ? 1 : 0, _cc: getDot() ? '#0000' : '' })
        : clickShowExamples();
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
        clickShowExamples();
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
        divider: { active: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0, },
        isAutoMobileDesktop: 0,
        isMobileInitial: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        lastViewportHeight: window.visualViewport ? window.visualViewport.height : window.innerHeight,
        lspre: 'lsystem_',
    });
    el.textarea.dataset.placeholder = strings.textarea.placeholder;
}

function setupCustomLog() {
    toggleCustomLog(true, (...args) => {
        if (el.buttonlog) {
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
    el.divider.classList.toggle('dividerv', !isMobile());
    el.divider.classList.toggle('dividerh', isMobile());
    el.divider.addEventListener('pointerdown', e => {
        state.divider.active = e.target;
        state.divider.startX = e.clientX;
        state.divider.startY = e.clientY;
        state.divider.startWidth = el.left.offsetWidth;
        state.divider.startHeight = el.textarea.offsetHeight;
    }, { passive: true });
    window.addEventListener('pointerup', () => state.divider.active = null, { passive: true });
    window.addEventListener('pointermove', e => {
        if (state.divider.active !== el.divider) return;
        if (isMobile()) {
            const deltaY = e.clientY - state.divider.startY;
            const newHeight = state.divider.startHeight + deltaY;
            el.left.style.height = `${Math.min(Math.max(newHeight, 50), window.innerHeight - 50)}px`;
        } else {
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
    el.textareaClose?.addEventListener('click', () => el.textarea.blur());
    el.textarea.addEventListener('paste', e => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        // deprecated, but it has features: ctrl+z, leaves cursor in place, better htmlAsPlaintext, newline
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
    ael(el.buttondot, toggleDot);
    ael(el.buttontpbg, toggleTpbg);
    ael(el.buttonnexteg, clickNextExample);
    ael(el.buttondefs, (i) => setText(i ? addDefaults(getText()) : addVb(getText(), getViewBox(1))));
    ael(el.buttonalleg, clickShowExamples);
    ael(el.buttonpng, clickDownloadPng);
    ael(el.buttonjs, () => clickOpenStandaloneSvg());
    ael(el.buttonsvg, () => downloadSvg(getSvg()));
    ael(el.buttonjson, () => copy(JSON.stringify(getRules(getText()))));
    ael(el.buttonline, () => copy(stringify(getText())));
    ael(el.buttonlines, () => copy(stringify(getText()).replace(/,/g, '\n')));
    ael(el.buttonexport, () => toggleExport());
    ael(el.buttonminilog, () => toggleMinilog());
    ael(el.buttonhelp, () => show(el.readme));
    //initHelp(el.buttonhelp, state.lspre);
}

function localstorageReset() { ['export', 'minilog', 'R'].forEach(k => localStorage.removeItem(state.lspre + k)); }
function localstorageSave(s, o) {
    function set(k, v) { (!s || s === k) && localStorage.setItem(state.lspre + k, v); }
    try { set('R', stringify(o || getText())); } catch (e) { return; }
    set('export', el.buttonexport.getAttribute('data-checked') === null);
    set('minilog', el.buttonminilog.getAttribute('data-checked') === null);
}
async function localstorageLoad() {
    function get(k) { return localStorage.getItem(state.lspre + k); }
    toggleExport(get('export') === 'false');
    toggleMinilog(get('minilog') === 'false');
    const r = get('R');
    await (r && r !== '' && r !== '{}' ? update(r) : clickShowExamples());
}

function init() {
    setupConsts();
    // [...document.querySelectorAll('[data-r]')].forEach(e => e.data = datasvg + '#' + e.getAttribute('data-r'));
    setupCustomLog();
    setupDividers();
    setupMobileKeyboard();
    setupEventListeners();
    updateFromLocation() || localstorageLoad();
    el.textarea.setAttribute('contenteditable', true);
}

/* end of fun */

const el = {}, state = {};
document.addEventListener('DOMContentLoaded', init);