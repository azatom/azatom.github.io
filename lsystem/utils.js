const mc = new MessageChannel();
export function yieldOnce() {
    return new Promise(resolve => {
        mc.port1.onmessage = () => (mc.port1.onmessage = null, resolve());
        mc.port2.postMessage(null);
    });
}

export function toggleCustomLog(enable, customLog, _ = console) {
    if (typeof customLog === 'function') {
        _.oldLog ??= _.log;
        _.customLog = customLog;
    }
    if (_.oldLog && _.customLog) {
        _.log = enable ? _.customLog : _.oldLog;
    }
}

export async function wrappedRun(isInterruptible, fn, arg, state, progress) {
    let ac;
    try {
        let pleaseStop;
        if (isInterruptible) {
            state.ac?.abort();
            state.ac = ac = new AbortController();
            progress(0)
            await yieldOnce();
            pleaseStop = async (n) => {
                if (ac.signal.aborted) return isInterruptible;
                progress(n);
                if (n % 1e4 === 0) {
                    await yieldOnce();
                    if (ac.signal.aborted) return isInterruptible;
                }
                return undefined;
            };
        }
        const res = await fn(arg, undefined, pleaseStop);
        isInterruptible && clearTimeout(state.timer);
        return res;
    } catch (e) {
        progress(e.message || strings.errors.e);
        // message(e.message || strings.errors.e, 0, strings.errors.e);
        await yieldOnce();
    } finally {
        if (isInterruptible) {
            state.ac = null;
        }
    }
}