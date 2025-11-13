export function initHelp(helpButton, lspre = 'help') {
  const README = '../README.md';
  const LS_KEY = `${lspre}.readme.md`;

  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.min.js';
  markedScript.integrity = 'sha512-V6rGY7jjOEUc7q5Ews8mMlretz1Vn2wLdMW/qgABLWunzsLfluM0FwHuGjGQ1lc8jO5vGpGIGFE+rTzB+63HdA==';
  markedScript.crossOrigin = 'anonymous';
  markedScript.referrerpolicy = 'no-referrer';
  markedScript.async = true;
  document.head.append(markedScript);

  const modalId = 'helpModal' + Math.random().toString(36).slice(2);
  document.body.insertAdjacentHTML('beforeend', `
    <div id="${modalId}" style="display:none;position:fixed;inset:0;background:#0008;z-index:9999;
      justify-content:center;align-items:center">
      <div style="position:relative;background:#fff;padding:1em;overflow:hidden">
        <div style="position:absolute;right:0;top:0;height:1.5rem;width:1.5rem;line-height:1;font-size:1.5rem;cursor:pointer;" class="close">✕</div>
        <style>#${modalId} .md code{background:#eee;display:inline-block}
        #${modalId}.wsn .md{white-space:normal!important;}</style>
        <div class="md" style="overflow:auto;white-space:pre-wrap;max-height:90vh;max-width:66ch;
        font-family:system-ui,Arial,sans-serif;line-height:1.2;"></div>
      </div>
    </div>`);

  function hide() { modal.style.display = 'none'; }
  const modal = document.getElementById(modalId);
  modal.addEventListener('click', e => e.target === modal && hide());
  modal.querySelector('.close').onclick = hide;
  const textDiv = modal.querySelector('.md');
  let cachedMd = null;
  const mdPromise = fetch(README, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(md => {
      try {
        localStorage.setItem(LS_KEY, textDiv.textContent = cachedMd = md);
      } catch (_) { }
      return md;
    })
    .catch(() => localStorage.getItem(LS_KEY) ?? '');
  async function render(t = 0) {
    try {
      textDiv.innerHTML = marked.parse(cachedMd ?? await mdPromise);
      modal.classList.add("wsn");
      return textDiv.textContent !== '';
    } catch (e) {
      if (t < 1e4) setTimeout(() => render(t = t * 1.5 + 10), t);
      else return false;
    }
  }
  helpButton.onclick = async () => {
    if (await render())
      modal.style.display = "flex"
    else
      document.querySelector('#objectreadme').classList.toggle('hidden');
  };
}
