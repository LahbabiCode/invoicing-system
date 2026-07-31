// CDP real mouse click on element
// Usage: node cdp-click.mjs <tabId> <buttonText>
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
  const evalJS = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result?.result?.value;
  };

  // Find element center coords
  const coords = await evalJS(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => (x.textContent||'').trim() === ${JSON.stringify(text)});
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width/2, y: r.y + r.height/2, w: r.width, h: r.height };
  })()`);
  if (!coords) throw new Error('button not found: ' + text);
  console.log('coords:', JSON.stringify(coords));

  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: coords.x, y: coords.y });
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: coords.x, y: coords.y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: coords.x, y: coords.y, button: 'left', clickCount: 1 });
  console.log('clicked at', coords.x, coords.y);
  ws.close();
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1); });
