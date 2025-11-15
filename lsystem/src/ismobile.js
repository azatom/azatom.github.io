let mq;
const maxMobile = '--max-mobile';
const handler = () => document.body.classList.toggle('mobile-view', mq.matches);
let handler2;
initMobile();

export function initMobile(handler2_) {
  handler2 = handler2_;
  const bp = getComputedStyle(document.documentElement).getPropertyValue(maxMobile).trim();
  mq = window.matchMedia(`(max-width: ${bp})`);
  mq.addEventListener('change', handler);
  handler();
  handler2 && mq.addEventListener('change', handler2) && handler2(mq);
}

export function isMobile() {
  return mq.matches;
}

export function forceMobile(mobile) {
  document.documentElement.style.setProperty(maxMobile, mobile ? '1px' : '9999px');
  initMobile(handler2);
};

export function isMobileAgent() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
