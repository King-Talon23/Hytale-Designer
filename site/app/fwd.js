// On the old address every page forwards to the new one, or first to the moving page when this browser has things saved here.
// The page's own code waits for this module, and it never finishes while the browser is leaving.
import { onOld, moved, gather, worthMoving, NEW_ORIGIN } from './moving.js';

if (onOld()) {
  let keep = false;
  if (!moved()) {
    try {
      keep = worthMoving(await gather());
    } catch {
      /* storage unreadable: nothing to bring */
    }
  }
  location.replace(keep ? '/move' : NEW_ORIGIN + location.pathname + location.search + location.hash);
  await new Promise(() => {});
}
