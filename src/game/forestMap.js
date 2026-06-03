import forestMap from '../data/forestMap.json';

export function getForestMap() {
  return forestMap;
}

export function getCamera(player, map, viewport) {
  const maxX = Math.max(0, map.width - viewport.width);
  const maxY = Math.max(0, map.height - viewport.height);

  return {
    x: clamp(player.x - viewport.width / 2, 0, maxX),
    y: clamp(player.y - viewport.height / 2, 0, maxY),
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
