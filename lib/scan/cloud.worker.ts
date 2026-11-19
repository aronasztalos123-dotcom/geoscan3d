/// <reference lib="webworker" />
import { buildCloud } from "./house";

// A ~130 ezer pont előállítása külön szálon, hogy a fő szálat ne foglalja (TBT).
self.onmessage = (e: MessageEvent<{ density: number }>) => {
  const c = buildCloud(e.data.density);
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(c, [c.pos.buffer, c.col.buffer, c.kind.buffer]);
};
