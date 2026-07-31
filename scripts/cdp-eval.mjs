// CDP helper: connect to Chrome tab, evaluate JS, get result
// Usage: node cdp-eval.js <tabId> '<js>'
const tabId = process.argv[2];
const js = process.argv[3];

async function main() {
  const tabs = await (await fetch('http://localhost:9222/json')).json();
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) throw new Error('tab not found: ' + tabId);

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

  const result = await send('Runtime.evaluate', {
    expression: js,
    returnByValue: true,
    awaitPromise: true,
  });
  console.log(JSON.stringify(result.result?.result?.value ?? result.result, null, 2));
  ws.close();
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
