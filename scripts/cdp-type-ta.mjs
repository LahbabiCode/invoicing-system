// CDP type into textarea by selector
// Usage: node cdp-type-ta.mjs <tabId> <selector> <text>
const tabId = process.argv[2];
const selector = process.argv[3];
const text = process.argv[4];

async function main() {
  const tabs = await (await fetch('http://localhost:9222/json')).json();
  const tab = tabs.find((t) => t.id === tabId);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalJS = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result?.result?.value;
  };

  // Focus the textarea inside this same WS session
  const focused = await evalJS(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    el.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(el, '');
    el.dispatchEvent(new Event('input', {bubbles:true}));
    return true;
  })()`);
  if (!focused) throw new Error('textarea not found: ' + selector);

  await send('Input.insertText', { text });
  await new Promise((r) => setTimeout(r, 300));
  const val = await evalJS(`document.querySelector(${JSON.stringify(selector)}).value`);
  console.log('typed, value now:', JSON.stringify(val));
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
