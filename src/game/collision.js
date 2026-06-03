export function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function getPlayerCollisionBox(player, config) {
  return {
    x: player.x - config.collisionWidth / 2,
    y: player.y - config.collisionHeight / 2 + 12,
    width: config.collisionWidth,
    height: config.collisionHeight,
  };
}

export function collidesWithAny(rect, colliders) {
  return colliders.some((collider) => rectsIntersect(rect, collider));
}

export function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
