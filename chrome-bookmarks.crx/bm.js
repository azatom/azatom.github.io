const bm = {};
const error = (...a) => bm.view.txt3.textContent = a.join('|');

/*
dupes:
((cnt = counter(), a) => {
    foreachBranch(b =>
        b.children.filter(
            c => !('children' in c)
        ).forEach(
            c => cnt.inc(
                c.url
                .replace(/^[^:]*:\/*(www\.)?/, '')
                .replace(/\/$/, '')
            )
        )
    );
    a = Object.entries(cnt.data)
    .filter(a => a[1] > 1)
    .sort((a, b) => b[1] - a[1])
    .map(a => a[0]);
    copy(a.join('\n'));
})();

domains:
((cnt = counter(), a) => {
  const re = new RegExp('/.*');
  foreachBranch(b =>
    b.children.filter(
      c => !('children' in c) && !c.url.startsWith('javascript')
    ).forEach(
      c => cnt.inc(c.url.replace(/^[^:]*:\/*(www\.)?/, '').replace(re, ''))
    )
  );
  a = Object.entries(cnt.data);
  a.sort((a, b) => a[1] - b[1]);
  a = a.map(a => a[1] + ' ' + a[0]);
  copy(a.join('\n'));
})();

domainfilter:
((d,a=[])=>{foreachChild(c => -1 < c?.url?.indexOf(d) && a.push([c.dateAdded,c.title,c.url]));a.map(JSON.stringify).join('\n');})('ycombinator.com')

min3x:
((cnt=counter())=>{foreachChild(c=>'children' in c || cnt.inc(c.url)); copy(Object.entries(cnt.data).filter(a=>a[1]>2).map(([a,b])=>[b,a]).join('\n'))})()
*/
const strings = {
    fileHtml: 'bm.html',
    fileJs: 'bm.js',
    fileJson: 'bm.json',
    jsonChildren: 'children',
    jsonUrl: ['url', 'uri'],
    jsonFields: ['dateAdded', 'date_added', 'name', 'title', 'url', 'uri'],
    roots: 'roots',
    date: '📆',
    PS: '❯',
    // '<span class="ico-pathseparator"></span>',
};

const epoch = any => typeof any === 'object' ? any instanceof Date ? any.getTime() / 1000 : epoch(any?.dateAdded ?? any?.date_added) : any < 1E13 ? any : any < 1E16 ? any / 1E3 : any / 1E3 - 116444736E5;

const getUrl = node => node?.[strings.jsonUrl.find(k => k in node)];

const counter = () => ({
    data: new Map(),
    inc(k) {
        this.add(k, 1);
    },
    add(k, a) {
        this.data[k] = a + (this.data?.[k] ?? 0);
    },
    max(k, v) {
        this.data[k] = Math.max(this.data?.[k] ?? v, v);
    },
});

const time = {
    t: 0,
    c: counter(),
    add(a) {
        const t0 = this.t;
        this.c.add(a, (this.t = performance.now()) - t0);
    },
    toString() {
        return `<table>${obj2tr(this.c.data)}<tr><th></th><th>sum</th><th>${~~(this.t)}</th></tr></table>`;
    }
};
time.add('0|0');

const Bmview = () => ({
    anchors: new Map(),
    anchorsort: null,
    txt1: null,
    txt2: null,
    txt3: null,
    input: null,
    treeDiv: null,
    panel: null,
    dark: null,
    dots: (a => {
        a.classList.add('fld');
        return a;
    }
    )(document.createElement('a')),
    onhashchangeLock: false,
    all: false,
    sorted: 1,
    lastSearch: '.',
    // #_1 #1 #0 #_0 1=sorted->lastSearch='.'
    rempx: 12,
});

const Bmmodel = (tree) => ({
    json: tree,
    descendantCountByNode: new Map,
    parentByNode: new Map,
    idByNode: new Map,
    nodeById: new Map,
    pidById: [],
    counters: counter(),
});

const gensort = (a, b) => ((A, B) => !isNaN(A) && !isNaN(B) ? A - B : !isNaN(A) ? -1 : !isNaN(B) ? 1 : a.localeCompare(b))(parseFloat(a), parseFloat(b));

const zoom = z => typeof z === 'undefined' ? parseFloat(document.body.style.zoom || 1) : document.body.style.zoom = z;

const addClickOrEnter = (el, fn) => {
    el.addEventListener('click', e => {
        if (bm.view.panel.dataset.dragging === '1')
            return;
        fn(e);
    }
    );
    el.addEventListener('keypress', e => {
        e.key === 'Enter' && (e.stopPropagation(),
            fn(e));
    }
    );
    // el.tabIndex = 0;
    // el.href='#';
}
    ;

// const stringOrPath = (a) =>
//     Array.isArray(a)
//         ? a.map(v => `<span class="ico-ps">${v}</span>`).join('')
//         : a;

const arr2trs = (arr, leftalign = false) => arr.map(a => '<tr>' + a.map((e, i, a) => `<td${((i || a.length === 1) && leftalign) ? ' class=left' : ''}>${e}</td>`).join('') + '</tr>').join('');

const obj2trs = obj => Object.keys(obj).sort(gensort).map(k => `<tr><td>${k.split('|').join('</td><td>')}</td><td>${k === strings.date ? fmtDa(obj[k]) : ~~obj[k]}</td></tr>`).join('');

const obj2tr = obj => Object.keys(obj).map(k => `<tr><td>${k.split('|').join('</td><td>')}</td><td>${k === strings.date ? fmtDa(obj[k]) : ~~obj[k]}</td></tr>`).join('');

const downloadData = (data, filename = '', type = 'text/plain') => {
    if (data == null)
        throw Error();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([data], {
        type: type
    }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}
    ;

const queryParams = (def = 'q=') => {
    const str1 = location.href.split(/[?]/)[1]?.replace(/#.*/, '');
    const str2 = str1 ? decodeURIComponent(str1) : def;
    const str3 = str2.replace(/=/g, '":"').replace(/&/g, '","');
    try {
        return JSON.parse(`{"${str3}"}`);
    } catch (_) {
        error('Invalid QueryParams', str2);
        return {};
    }
    ;
}
    ;

const getDescsendants = obj => {
    return obj[strings.jsonChildren] ? getDescsendantsCache(obj) : [1, 0];
    function sum(a, b) {
        return a.map((v, i) => v + b[i]);
    }
    function calcDesc(obj) {
        return obj[strings.jsonChildren].map(getDescsendants).reduce(sum, [0, 1]);
    }
    function getDescsendantsCache(obj) {
        return bm.model.descendantCountByNode.get(obj) || (cnt => (bm.model.descendantCountByNode.set(obj, cnt),
            cnt))(calcDesc(obj));
    }
}
    ;

function toggleDark() {
    document.documentElement.classList.toggle('dark');
}

function getQ(e) {
    if (typeof e === 'object')
        return maybeHidenQuery(e.target.value);
    // if (typeof e === 'object' && e.target.value !== '') return maybeHidenQuery(e.target.value);
    // if (typeof e === 'object') e = 1234; // hmmm..

    if (typeof e !== 'undefined' && e !== '')
        return maybeHidenQuery(e);
    if (typeof bm.view.lastSearch !== 'undefined' && bm.view.lastSearch !== '')
        return bm.view.lastSearch;
    if (bm.view.input.value !== '')
        return bm.view.input.value;
    if (location.hash !== '')
        return location.hash.replace(/^#_?/, '#_');
    return undefined;
    function maybeHidenQuery(q) {
        if (q.toString().startsWith('#'))
            bm.view.input.value = '';
        return bm.view.lastSearch = q;
    }
}

const onSearch = (() => {
    const listBefore = [];
    return {
        add: f => listBefore.push(f),
        before: () => listBefore.forEach(f => f()),
    };
}
)();

const search = e => {
    onSearch.before();
    // const t = performance.now();
    const q = getQ(e).toString();
    if (q === undefined) {
        error('search', e);
        return;
    }

    const maxDisplay = bm.view.all || q.startsWith('#') ? Infinity : window.innerHeight / (zoom() * bm.view.rempx) | 0;
    const qmatcher = searchMatcher(q);
    if (qmatcher === undefined)
        return;
    const displayed = {
        all: 0,
        bm: 0,
        not: 0,
        lastPid: undefined
    };
    const newItems = [];

    for (const [_, v] of bm.view.sorted ? bm.view.anchorsort : bm.view.anchors) {
        if (qmatcher(v)) {
            if (displayed.all++ < maxDisplay) {
                newItems.push(v);
                const pid = v.dataset.pid;
                v.classList.toggle('newpid', displayed.lastPid !== pid);
                displayed.lastPid = pid;
            } else {
                displayed.not++;
            }
            if (v.classList.contains('bm'))
                displayed.bm++;
        }
    }
    if (displayed.not)
        newItems.push(bm.view.dots);
    bm.view.treeDiv.replaceChildren(...newItems);
    bm.view.txt1.textContent = (displayed.not ? `${displayed.all - displayed.not} … ` : '') + displayed.bm;
    //bm.view.txt2.textContent = `${~~(performance.now() - t)}ms`;

    return;

    function searchByHoc() {
        return v => v.classList.contains('ml');
    }

    function searchByDate(re) {
        return v => v.dataset.date.match(re);
    }

    function searchByFoof(foof) {
        switch (foof) {
            case 'long':
                return v => 'href' in v && v.href.length > 2000 && !v.href.startsWith('javascript:') && !v.href.startsWith('data:') || v.textContent.length > 254;
            default:
                alert('unimplemented ' + foof);
        }
    }

    function searchById(id, pid) {
        return el => el.id === id || id.startsWith('_') && el.dataset.pid === id || el.dataset.pid === pid || el.id === '_' + bm.model.pidById[id];
    }

    function searchByRegexp(re) {
        return v => v.textContent.match(re) || v.classList.contains('bm') && v.href?.match(re);
        // || v.classList.contains('path');
    }

    function searchMatcher(q) {
        try {
            bm.view.input.classList.remove('error');
            if (q === '#_') {
                return el => el.id.startsWith('_');
            } else if (q.startsWith('##')) {
                return searchByFoof(q.substring(2));
            } else if (q.startsWith('#')) {
                return searchById(q.substring(1), '_' + bm.model.pidById[q.substring(1)]);
            } else if (q.startsWith('date:')) {
                return searchByDate(new RegExp(q.substring(5)));
            } else if (q === '-') {
                return searchByHoc();
            } else {
                return searchByRegexp(new RegExp(q, 'ui'));
            }
        } catch (_) {
            bm.view.input.classList.add('error');
            return undefined;
        }
        ;
    }
}
    ;

const toomuch = (maxFn, fltr, rec = false, cnt = counter()) => {
    foreachBranch(c => {
        const arr = Array.from(createPath(c).querySelectorAll('a'));
        do {
            cnt.add(arr.map(a => a.textContent).join(strings.PS), c.children.filter(fltr).length);
            arr.pop();
        } while (rec && arr.length);
    }
    );
    const a = Object.entries(cnt.data).filter(a => maxFn(a[1]));
    a.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return {
        arr: a.map(a => [a[1], a[0]]),
        leftalign: true,
    };
}
    ;

const nourls = () => toomuch(a => !a, c => !c.children, true);
const emptyfolder = () => toomuch(a => !a, c => 1);
const toomuchurls = () => toomuch(a => a > 99, c => !c.children);
const toomuchfolders = () => toomuch(a => a > 24, c => c.children);

const createTable = () => {
    const table = document.createElement('table');
    table.classList.add('hide', 'click');

    const dateRe = new RegExp('^(?<year>[0-9][0-9][0-9][0-9])-(?<month>[0-9][0-9])-(?<day>[0-9][0-9])T(?<hour>[0-9][0-9]):(?<minute>[0-9][0-9]):(?<second>[0-9][0-9])(?<ms>.[0-9]*)(?<offset>[+-][0-9:]+)$');
    const dateReLast = 'offset';

    const stats = {
        //...Object.fromEntries(Object.keys(dateRe.exec(fmtDate(0)).groups).map(k => [k, undefined])),
        time: time,
        emptyfolder: emptyfolder,
        nourls: nourls,
        toomuchfolders: toomuchfolders,
        toomuchurls: toomuchurls,
        protocol: bm.model.counters,
        schema: counterOfJsonSch,
    };

    const initDates = title => {
        Object.entries(stats).forEach(([k, v]) => v === undefined && (stats[k] = counter()));

        foreachChild(c => Object.entries(dateRe.exec(fmtDate(c)).groups).forEach(([k, v]) => stats[k].inc(k === 'ms' ? parseFloat(v) : v)));
        return stats[title];
    }
        ;

    const toTrs = stat => {
        const x = typeof stat === 'object' ? stat : stat();
        return 'arr' in x ? arr2trs(x.arr, x?.leftalign ?? false) : obj2trs(x.data);
    }
        ;

    const tableClick = e => {
        if (e?.altKey)
            return;
        e?.stopPropagation();
        const titles = Object.keys(stats);
        table.title = titles[(Math.max(titles.indexOf(table.title), 0) + (e?.shiftKey ? titles.length - 1 : 1)) % titles.length];
        const stat = stats[table.title] === undefined ? initDates(table.title) : stats[table.title];
        table.innerHTML = stat === time ? time : toTrs(stat);
        table.createCaption().textContent = table.title;
    }
        ;
    addClickOrEnter(table, tableClick);

    table.title = dateReLast;

    return table;
}
    ;

const createPanel = () => {
    const panel = document.createElement('div');
    panel.classList.add('panel');

    const tables = createTable();
    panel.appendChild(tables);

    const asdf = document.createElement('div');
    asdf.classList.add('asdf');
    asdf.appendChild(bm.view.input = createInput());
    asdf.appendChild(bm.view.txt1 = createTxt());
    asdf.appendChild(bm.view.txt2 = createTxt());
    asdf.appendChild(bm.view.txt3 = createTxt());
    asdf.appendChild(createSort());
    asdf.appendChild(createUnlimited());
    asdf.appendChild(createStat(tables));
    asdf.appendChild(createZoom());
    asdf.appendChild(createDateOrRownum());
    asdf.appendChild(createUpload());
    asdf.appendChild(createExportloink());
    asdf.appendChild(createRot());
    asdf.appendChild(createFoof());
    asdf.appendChild(bm.view.dark = createDark());
    panel.appendChild(asdf);

    return panel;

    function createButton(txt, fn) {
        const a = document.createElement('a');
        a.textContent = txt;
        addClickOrEnter(a, e => {
            e.target.classList.toggle('on');
            fn(e);
        }
        );
        return a;
    }
    function createExportloink() {
        const a = document.createElement('a');
        a.textContent = 'export';
        // addClickOrEnter(a, () => window.chrome.bookmarks.getTree(downloadHtml(true)));
        addClickOrEnter(a, e => {
            downloadHtml(!e.shiftKey)(bm.model.json);
        }
        );
        a.title = '(Ctrl+S) ' + (a => (a.href = '',
            a.href))(document.createElement('a'));
        document.addEventListener('keydown', e => e.ctrlKey && e.key === 's' && (e.preventDefault(),
            a.click(),
            a.classList.add('on'),
            setTimeout(() => a.classList.remove('on'), 1000)));
        return a;
    }

    function createTxt() {
        const div = document.createElement('span');
        div.classList.add('txt');
        return div;
    }

    function createInput() {
        const input = document.createElement('input');
        input.style.display = 'inline';
        input.type = 'search';
        input.addEventListener('input', search);
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', false);
        input.setAttribute('name', 'inputsearch');
        return input;
    }

    function createUpload() {
        const a = document.createElement('a');
        a.textContent = 'loadjson';

        const input = document.createElement('input');
        a.appendChild(input);
        input.type = 'file';
        input.setAttribute('accept', 'application/json');
        input.setAttribute('name', 'upload');
        input.addEventListener('change', e => {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    init(JSON.parse(e.target.result));
                } catch (e) {
                    error('onload', e);
                }
            }
                ;
            reader.readAsText(e.target.files[0]);
            bm.src = e.target.files[0].name;
        }
        );
        //async function parseJsonFile(file) {
        //  return new Promise((resolve, reject) => {
        //    const fileReader = new FileReader()
        //    fileReader.onload = event => resolve(JSON.parse(event.target.result))
        //    fileReader.onerror = error => reject(error)
        //    fileReader.readAsText(file)
        //  })
        //}
        //const object = await parseJsonFile(file)

        a.appendChild(input);
        addClickOrEnter(a, e => {
            input.click(e);
        }
        );
        window.addEventListener('keydown', e => e.ctrlKey && e.key === 'o' && !e.preventDefault() && input.click(e));
        return a;
    }

    function createStat(tables) {
        return createButton('stat', e => {
            tables.classList.toggle('hide');
            tables.click();
        }
        );
    }

    function createUnlimited() {
        return createButton('all', e => {
            bm.view.all = ~bm.view.all;
            search();
        }
        );
    }

    function createZoom() {
        return createButton('zoom', e => {
            const z = (x => [1, 3 / 2, 2 / 3][x < 2 ? ~~(1.4 * x) : 2])(zoom());
            zoom(z);
            e.target.textContent = z > 1.001 ? 'zoom 150%' : z < 0.99 ? 'zoom 66%' : 'zoom';
            e.target.classList.toggle('on', z < 0.99 || 1.01 < z);
        }
        );
    }
    ;
    function createSort() {
        const b = a => ['folder', 'date'][a];
        return createButton(b(bm.view.sorted), e => {
            e.target.textContent = b(bm.view.sorted = 1 - bm.view.sorted);
            search();
        }
        );
    }

    function createDateOrRownum() {
        return createButton('d/#', e => bm.view.treeDiv.classList.toggle('ordered'));
    }

    function createRot() {
        return createButton('rot', e => document.documentElement.classList.toggle('rot'));
    }

    function createDark() {
        return createButton('🌙', toggleDark);
    }

    function createFoof() {
        const txt = 'foof';
        const a = createButton(txt, e => {
            search('##long');
            e.target.textContent = 'long';
            e.target.classList.toggle('on', false);
        }
        );
        onSearch.add(() => a.textContent = txt);
        return a;
    }

    function createHover() {
        return createButton('hover', e => (bm.view.panel.classList.toggle('moveable'),
            bm.view.panel.classList.toggle('toprow')));
    }
}
    ;

const any2date = any => any instanceof Date ? any : new Date(epoch(any));

const fmtDate = any => (date => {
    const tzo = date.getTimezoneOffset();
    const sgn = tzo > 0 ? '-' : '+';
    const pad = num => String(num).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds()) + sgn + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60);
}
)(any2date(any));

const fmtDa = any => (date => String(date.getFullYear()).substring(2, 10) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2))(any2date(any));

const setDataCnt = (el, node) => {
    const [childs, descLeafs, notAscBranches] = [node[strings.jsonChildren].length, ...getDescsendants(node)];
    el.dataset.cnt = `${[childs, descLeafs - childs, notAscBranches - 1]}`;
}
    ;

const createPath = node => {
    const path = document.createElement('div');
    path.classList.add('path');
    path.id = `_${bm.model.idByNode.get(node)}`;
    setDataCnt(path, node);
    path.dataset.da = fmtDa(node);
    path.dataset.date = fmtDate(node);
    do {
        const a = document.createElement('a');
        a.textContent = node?.title ?? node.name;
        a.href = `#_${bm.model.idByNode.get(node) || '0'}`;
        path.prepend(a);
        node = bm.model.parentByNode.get(node);
    } while (node !== undefined);
    return path;
}
    ;

const processChildOf = parent => node => {
    if (typeof node !== 'object')
        return;
    //node = { title: node };
    bm.model.idByNode.set(node, bm.model.idByNode.size);
    const pid = bm.model.idByNode.get(parent) || 0;
    const id = bm.model.idByNode.get(node);
    bm.model.nodeById.set(id, node);
    bm.model.pidById[id] = pid;
    const date = epoch(node);
    if (Number.isFinite(date)) {
        bm.model.counters.max(strings.date, date);
    }
    if (strings.jsonChildren in node) {
        bm.model.counters.inc('#folder');
        bm.model.parentByNode.set(node, parent);
    } else {
        const url = getUrl(node);
        if (url !== undefined) {
            bm.model.counters.inc('#url');
            bm.model.counters.inc(url.replace(/^([^:]*):.*/, '$1:'));
        } else {
            bm.model.counters.inc('#other');
        }
    }
}
    ;

const createElementsOf = parent => node => {
    if (typeof node !== 'object')
        return;
    //node = { title: node };
    const pid = bm.model.idByNode.get(parent) || 0;
    const id = bm.model.idByNode.get(node);
    const a = document.createElement('a');
    bm.view.anchors.set(id, a);
    a.id = id;
    a.dataset.pid = `_${pid}`;
    a.textContent = node?.title ?? node.name;
    a.dataset.da = fmtDa(node);
    a.dataset.date = fmtDate(node);
    if (strings.jsonChildren in node) {
        a.classList.add('fld');
        a.href = `#_${id}`;
        setDataCnt(a, node);
    } else {
        const url = getUrl(node);
        if (url !== undefined) {
            a.classList.add('bm');
            a.href = url;
            a.target = '_blank';
        } else {
            a.classList.add('bm', 'ml');
            a.textContent = JSON.stringify(node);
            a.target = '_blank';
        }
    }
}
    ;

const viewBranch = branch => {
    bm.view.anchors.set(`_${bm.model.idByNode.get(branch)}`, createPath(branch));
    branch[strings.jsonChildren].forEach(createElementsOf(branch));
}
    ;

const modelBranch = branch => {
    if (!bm.model.idByNode.has(branch)) {
        bm.model.idByNode.set(branch, bm.model.idByNode.size);
        bm.model.nodeById.set(bm.model.idByNode.size - 1, branch);
        bm.model.parentByNode.set(branch, undefined);
    }
    branch[strings.jsonChildren].forEach(processChildOf(branch));
}
    ;

const foreachBranch = fn => {
    const queue = [{
        children: [...bm.model.json]
    }];
    const nexts = c => c[strings.jsonChildren].filter(child => typeof child === 'object' && strings.jsonChildren in child);

    for (let current; undefined !== (current = queue.shift()); queue.unshift(...nexts(current))) {
        fn(current);
    }
}
    ;

// const flatten = (o = bmmodel.json, path = []) => o.reduce((acc, e) => {
//   if (strings.jsonChildren in e) {
//     acc = acc.concat([path, flatten(e[strings.jsonChildren]))
//   } else
// });

const foreachChild = fn => foreachBranch(b => b[strings.jsonChildren].forEach(fn));

const counterOfJsonSch = () => {
    const cnt = counter();
    const detailedCounterKey = prefix => obj => Object.entries(obj).forEach(([k, v]) => cnt.inc(`${prefix}|${k}|${typeof v}`));

    foreachBranch(branch => {
        detailedCounterKey('branch')(branch);
        branch[strings.jsonChildren].filter(leaf => !leaf[strings.jsonChildren]).forEach(detailedCounterKey('leaf'));
    }
    );
    return cnt;
}
    ;

const throwError = e => {
    throw Error(e);
}
    ;

const consolidateInput = tree => {
    if (Array.isArray(tree)) {
        return tree;
    }
    if (typeof tree !== 'object') {
        throwError('not a json');
    }
    if (strings.jsonChildren in tree) {
        return tree[strings.jsonChildren];
    }
    if (strings.roots in tree) {
        return [{
            [strings.jsonChildren]: Object.values(tree.roots)
        }];
    }
    throwError('cepasa?');
}
    ;

const indexingDatesort = () => {
    const dateById = id => epoch(bm.model.nodeById.get(typeof id === 'number' ? id : parseInt(id.substring(1))));
    bm.view.anchorsort = new Map(Array.from(bm.view.anchors).sort((a, b) => dateById(b[0]) - dateById(a[0])));
}
    ;

const createTreeDiv = () => {
    const div = document.createElement('div');
    div.classList.add('tree');
    div.addEventListener('click', e => {
        const rulerwidth = parseFloat(window.getComputedStyle(document.querySelector('.ruler')).width);
        if ((e.clientX > 0 || e.clientY > 0) && e.clientX < zoom() * rulerwidth || e.shiftKey && e.key !== 'Enter') {
            e.preventDefault();
            location.hash = `#${e.target.id === '_0' ? '_' : e.target.id}`;
        } else if (e.target.classList.contains('ml')) {
            e.target.classList.toggle('opened');
        }
    }
    );
    return div;
}
    ;

const process = tree => {
    time.add('4|process');
    bm.model.json = consolidateInput(tree);
    time.add('5|process');
    foreachBranch(modelBranch);
    time.add('6|process');
    foreachBranch(viewBranch);
    time.add('7|process');
    indexingDatesort();
    time.add('8|process');
    if (location.hash) {
        window.onhashchange();
    } else {
        search(queryParams('q=').q);
    }
    bm.view.txt2.replaceChildren(getMaxDate());
    time.add('9|process');
}
    ;

const init = (tree) => {
    time.add('1|browserinit');
    document.body.innerHTML = `<div class=ruler>loading...</div>`;

    bm.model = Bmmodel(tree);
    bm.view = Bmview();
    document.body.appendChild(bm.view.panel = createPanel());
    setupDark();
    document.body.appendChild(bm.view.treeDiv = createTreeDiv());
    bm.view.rempx = parseFloat(getComputedStyle(document.documentElement).fontSize);

    /**/
    let fn;
    if (bm.model.json) {
        fn = f => f(bm.model.json);
    } else {
        bm.src = 'chrome:';
        fn = window.chrome.bookmarks.getTree;
    }
    fn(process);
    /*/
        if (typeof bm.model.json === 'undefined' && window?.chrome?.bookmarks?.getTree) {
            bm.src = 'chrome:';
            window?.chrome?.bookmarks?.getTree(process);
        } else {
            process(bm.model.json);
        }
    /**/

    document.querySelector('.ruler').textContent = '';
    time.add('2|initend');
}
    ;

function setupDark() {
    (e => (e.matches && (toggleDark(),
        bm.view.dark.classList.toggle('on')),
        e.addEventListener('change', toggleDark)))(window?.matchMedia('(prefers-color-scheme:dark)'));
}
function getMaxDate() {
    const div = document.createElement('span');
    div.textContent = `${bm?.src ?? 'js:'} ${strings.date}${fmtDa(bm.model.counters.data[strings.date])}`;
    div.title = `${fmtDate(bm.model.counters.data[strings.date])}`;
    return div;
}

const domLoaded = () => {
    time.add('0|dom');
    document.body.innerHTML = `<div class=ruler>loading...</div>`;
    const src = queryParams().json;
    if (src === undefined && window?.chrome?.bookmarks) {
        init();
    } else {
        fetch(src || strings.fileJson).then(response => response.json()).then(init).catch(() => {
            init(typeof inlinedjson === 'undefined' ? [] : inlinedjson);
            inlinedjson = undefined;
        }
        );
    }
}
    ;

const downloadHtml = (inline = false) => obj => {
    (async (urls) => {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        return await Promise.all(responses.map(res => res.text()));
    }
    )([strings.fileHtml, strings.fileJs]).then(([html, js]) => {
        const replacer = [strings.jsonChildren, ...strings.jsonFields];
        const json = JSON.stringify(obj, replacer).replace(/("ur[li]":")/g, '\n$1');
        if (inline) {
            const newScript = `${js}; let inlinedjson = ${json};`;
            const inline = '<script>' + newScript.split('</script>').join('<\\/script>') + '</script>';
            const src = `<script src="${strings.fileJs}"></script>`;
            const idx = html.indexOf(src);
            if (idx < 1) {
                error('no matching script tag in html and in js!', src);
                return;
            }
            const newHtml = html.substring(0, idx) + inline + html.substring(idx + src.length);
            downloadData(newHtml, 'bm.html', 'text/html');
        } else {
            downloadData(json, strings.fileJson, 'application/json');
            downloadData(html, strings.fileHtml, 'text/html');
            downloadData(js, strings.fileJs, 'text/javascript');
        }
    }
    );
}
    ;

window.onhashchange = e => {
    if (bm.view.onhashchangeLock)
        return;
    bm.view.onhashchangeLock = true;
    search(location.hash);
    const t = location.hash.substring(1);
    location.hash = '';
    location.hash = t;
    setTimeout(() => bm.view.onhashchangeLock = false, 0);
}
    ;

window.addEventListener('keydown', e => {
    if (e.target === bm.view.input)
        return;
    if (
        !e.shiftKey && !e.ctrlKey && !e.altKey && e.key !== 'Tab' && e.key !== 'Enter' ||
        e.ctrlKey && e.key === 'v' ||
        e.ctrlKey && e.key === 'f' && !e.preventDefault() ||
        e.shiftKey && e.key !== 'Tab' && e.key !== 'Shift' && e.key !== 'Enter'
    ) {
        // error('code', e.code, 'key', e.key);
        bm.view.input.value = '';
        bm.view.input.focus();
    }
}
);

window.addEventListener('DOMContentLoaded', domLoaded);
