import { PLAYER } from './constants.js';
import { collidesWithAny, getPlayerCollisionBox } from './collision.js';

export function normalizeInput(input) {
  let x = 0;
  let y = 0;

  if (input.left) x -= 1;
  if (input.right) x += 1;
  if (input.up) y -= 1;
  if (input.down) y += 1;

  const length = Math.hypot(x, y);
  if (length > 0) {
    return { x: x / length, y: y / length };
  }

  return { x: 0, y: 0 };
}

export function movePlayer(player, input, delta, map) {
  const direction = normalizeInput(input);
  const distance = PLAYER.speed * delta;
  const nextFacing = getFacing(player.facing, direction);

  let next = { ...player, facing: nextFacing, moving: direction.x !== 0 || direction.y !== 0 };

  const xCandidate = { ...next, x: next.x + direction.x * distance };
  if (!collidesWithAny(getPlayerCollisionBox(xCandidate, PLAYER), map.colliders)) {
    next = xCandidate;
  }

  const yCandidate = { ...next, y: next.y + direction.y * distance };
  if (!collidesWithAny(getPlayerCollisionBox(yCandidate, PLAYER), map.colliders)) {
    next = yCandidate;
  }

  return next;
}

function getFacing(currentFacing, direction) {
  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    return direction.x < 0 ? 'left' : 'right';
  }

  if (direction.y < 0) return 'up';
  if (direction.y > 0) return 'down';

  return currentFacing;
}
