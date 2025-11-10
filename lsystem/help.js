export function initHelp() {
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.min.js';
  markedScript.async = true;
  document.head.appendChild(markedScript);

  const helpHtml = `
    <div id="helpModal" style="display:none;position:fixed;inset:0;background:#000a;z-index:2">
      <div id="helpWindow" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
        background:#fff;padding:1em;border-radius:6px;box-shadow:0 0 10px #000a;overflow:hidden">
        <span style="float:right;cursor:pointer" id="helpClose">X</span>
        <div id="helpText" style="overflow:auto;line-height:1;font-size:.9rem;max-height:80vh;max-width:84ch"></div>
      </div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    .preasdiv { white-space: normal; font-family: system-ui, Arial, sans-serif; }
    .preasdiv2 { font-family: system-ui, Arial, sans-serif; }
    .preasdiv a { color: #17d; }
    .preasdiv code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
    .preasdiv pre { background: #f5f5f5; padding: 1em; border-radius: 6px; overflow: auto; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', helpHtml);
  const modal = document.getElementById('helpModal');
  const text = document.getElementById('helpText');

  async function loadMd() {
    try {
      const md = await fetch('README.md').then(r => r.text());
      return md;
    } catch {
      return localStorage.getItem('help_md') || 'Help text not available offline';
    }
  }

  async function showHelp() {
    modal.style.display = 'block';
    const md = await loadMd();
    const pre = document.createElement('pre');
    pre.textContent = md;
    pre.className = 'md preasdiv2';
    text.replaceChildren(pre);

    const renderMd = (t = 0) => {
      try {
        if (typeof marked !== 'undefined') {
          pre.innerHTML = marked.parse(md);
          pre.className = 'preasdiv';
        } else if (t < 1e4) {
          setTimeout(() => renderMd(t * 1.5 + 100), t);
        }
      } catch (e) { }
    };
    renderMd();
  }

  modal.addEventListener('click', e => e.target === modal && (modal.style.display = 'none'));
  document.getElementById('helpClose').onclick = () => modal.style.display = 'none';
  document.getElementById('buttonhelp').onclick = showHelp;

  fetch('README.md')
    .then(r => r.text())
    .then(md => localStorage.setItem('help_md', md))
    .catch(() => { });
}
