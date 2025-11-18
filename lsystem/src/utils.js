const mc = new MessageChannel();
export function yieldOnce() {
  return new Promise((resolve) => {
    mc.port1.onmessage = () => (mc.port1.onmessage = null, resolve());
    mc.port2.postMessage(null);
  });
}

export function toggleCustomLog(enable, customLog, _ = console) {
  if (typeof customLog === "function") {
    _.oldLog ??= _.log;
    _.customLog = customLog;
  }
  if (_.oldLog && _.customLog) {
    _.log = enable ? _.customLog : _.oldLog;
  }
}

export async function wrappedRun(acHolder, progress, fn, arg) {
  let ac;
  try {
    let pleaseStop;
    if (acHolder) {
      acHolder.abortController?.abort();
      acHolder.abortController = ac = new AbortController();
      progress(0);
      await yieldOnce();
      pleaseStop = async (n) => {
        if (ac.signal.aborted) return acHolder.interrupted;
        progress(n);
        await yieldOnce();
        return void 0;
      };
    }
    return await fn(arg, void 0, pleaseStop);
  } catch (e) {
    acHolder && progress(e.message || strings.error);
  } finally {
    acHolder && acHolder.abortController === ac && (acHolder.abortController = null);
  }
}
