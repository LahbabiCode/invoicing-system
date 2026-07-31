// CDP screenshot
// Usage: node cdp-shot.mjs <tabId> <outfile>
const tabId = process.argv[2];
const outFile = process.argv[3];
const fs = await import('fs');

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

  const r = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outFile, Buffer.from(r.result.data, 'base64'));
  console.log('saved', outFile);
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
