// Local development only: the developer's own Assets.zip, read in ranges through dev/serve.py (a few at a time, with retries).
export async function devSource() {
  const size = +(await fetch('/__assets.zip')).headers.get('X-Size');
  let active = 0; const waiting = [];
  const slot = () => active < 4 ? (active++, Promise.resolve()) : new Promise(r => waiting.push(r));
  const free = () => { const n = waiting.shift(); if (n) n(); else active--; };
  async function read(a, b) {
    await slot();
    try { for (let i = 0; ; i++) { try { return await (await fetch('/__assets.zip', { headers: { Range: `bytes=${a}-${b - 1}` } })).arrayBuffer(); } catch (e) { if (i > 4) throw e; await new Promise(r => setTimeout(r, 300 * (i + 1))); } } }
    finally { free(); }
  }
  return { size, read };
}
