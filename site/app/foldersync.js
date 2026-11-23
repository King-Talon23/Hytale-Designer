// One subfolder of the skins folder kept in step with what the site holds: write each file that changed, remember what was
// written, and delete the files the site wrote there earlier that are gone now. Works on a real folder handle and on the
// mod's stand-in alike (getFileHandle, createWritable, removeEntry).
//   wanted: [[name, body, mark?]] - mark tells a change (the body itself when there is none)
//   written: Map path -> mark of what is in the folder now; known: Set of paths the site wrote or read there
//   caseless: a file whose name only changed case is the same file (as on Windows), so it is not deleted
export async function mirrorDir(d, sub, wanted, { written, known, caseless = false }) {
  const keep = new Set();
  for (const [name, body, stamp] of wanted) {
    const path = sub + '/' + name,
      mark = stamp || body;
    keep.add(path);
    if (written.get(path) === mark) continue;
    const w = await (await d.getFileHandle(name, { create: true })).createWritable();
    await w.write(body);
    await w.close();
    written.set(path, mark);
    known.add(path);
  }
  const keepLow = caseless ? new Set([...keep].map(x => x.toLowerCase())) : null;
  for (const path of [...known]) {
    if (!path.startsWith(sub + '/') || keep.has(path)) continue;
    if (!keepLow?.has(path.toLowerCase())) {
      try {
        await d.removeEntry(path.slice(sub.length + 1));
      } catch {
        /* already gone */
      }
    }
    known.delete(path);
    written.delete(path);
  }
}
