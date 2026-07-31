// CDP keyboard typing helper: focus element, type text, click button
// Usage: node cdp-type.js <tabId> <selector> <text> [buttonSelector]
const tabId = process.argv[2];
const selector = process.argv[3];
const text = process.argv[4];
const buttonSel = process.argv[5];

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

  // Focus the element
  await evalJS(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await send('Input.insertText', { text });
  await evalJS(`document.querySelector(${JSON.stringify(selector)}).dispatchEvent(new Event('change', {bubbles:true}))`);

  if (buttonSel) {
    const clicked = await evalJS(`(() => { const b = [...document.querySelectorAll('button')].find(x => (x.textContent||'').trim() === ${JSON.stringify(buttonSel)}); if(!b) return false; b.click(); return true; })()`);
    console.log('clicked button:', clicked);
  }
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
