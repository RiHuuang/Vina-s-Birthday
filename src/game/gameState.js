export function createInitialCollectedState() {
  return new Set();
}

export function collectStar(collected, starId) {
  const next = new Set(collected);
  next.add(starId);
  return next;
}

export function getProgress(collected, total) {
  return {
    collectedCount: collected.size,
    total,
    isComplete: collected.size >= total,
  };
}

export function getCollectibleById(collectibles, id) {
  return collectibles.find((item) => item.id === id);
}
