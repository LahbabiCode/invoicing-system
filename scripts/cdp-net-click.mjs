const tabId = process.argv[2];
const btnText = process.argv[3];

async function main() {
  const tabs = await (await fetch('http://localhost:9222/json')).json();
  const tab = tabs.find((t) => t.id === tabId);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  const requests = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      requests.push(msg.params.request.method + ' ' + msg.params.request.url.slice(0, 120));
    }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

  await send('Network.enable');
  const clicked = await send('Runtime.evaluate', {
    expression: `(() => {
      const b = [...document.querySelectorAll('button')].find(x => (x.textContent||'').trim() === ${JSON.stringify(btnText)});
      if (!b) return false;
      b.click();
      return true;
    })()`,
    returnByValue: true,
  });
  console.log('clicked:', clicked.result?.result?.value);
  await new Promise((r) => setTimeout(r, 4000));
  console.log('requests:', JSON.stringify(requests, null, 1));
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
