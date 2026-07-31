// CDP type into focused element using Input.insertText
// Usage: node cdp-type-focus.mjs <tabId> <text>
const tabId = process.argv[2];
const text = process.argv[3];

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

  await send('Input.insertText', { text });
  console.log('typed:', text);
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
