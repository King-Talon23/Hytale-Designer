// Small things this browser remembers (localStorage). In a private window, or with storage blocked or full, nothing is kept
// and nothing breaks: reads give null and writes are dropped.
export function get(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
export function set(k, v) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private window or full */
  }
}
export function del(k) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* fine */
  }
}
// a stored JSON value, or null when there is none or it can't be read
export function getJson(k) {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null');
  } catch {
    return null;
  }
}
