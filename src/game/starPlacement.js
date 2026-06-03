import { STAR } from './constants.js';
import { distanceBetween } from './collision.js';

function getWalkabilityConfig(map) {
  return {
    starSafeMargin: map.walkability?.starSafeMargin ?? Math.ceil(STAR.size / 2),
    fallbackStep: map.walkability?.fallbackStep ?? 12,
    fallbackMaxRadius: map.walkability?.fallbackMaxRadius ?? 180,
  };
}

function expandRect(rect, margin) {
  return {
    x: rect.x - margin,
    y: rect.y - margin,
    width: rect.width + margin * 2,
    height: rect.height + margin * 2,
  };
}

function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function isPointWalkable(point, map, margin = 0) {
  if (
    point.x < margin ||
    point.y < margin ||
    point.x > map.width - margin ||
    point.y > map.height - margin
  ) {
    return false;
  }

  return !map.colliders.some((collider) => {
    if (collider.walkable === true) {
      return false;
    }

    return pointInRect(point, expandRect(collider, margin));
  });
}

export function isPointReachable(point, map, margin = getWalkabilityConfig(map).starSafeMargin) {
  const { fallbackStep } = getWalkabilityConfig(map);
  const start = map.spawn;

  if (!isPointWalkable(start, map, margin) || !isPointWalkable(point, map, margin)) {
    return false;
  }

  const queue = [{ x: Math.round(start.x), y: Math.round(start.y) }];
  const visited = new Set([`${queue[0].x},${queue[0].y}`]);
  const directions = [
    [fallbackStep, 0],
    [-fallbackStep, 0],
    [0, fallbackStep],
    [0, -fallbackStep],
  ];

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];

    if (distanceBetween(current, point) <= fallbackStep * 1.5) {
      return true;
    }

    for (const [dx, dy] of directions) {
      const next = {
        x: current.x + dx,
        y: current.y + dy,
      };
      const key = `${next.x},${next.y}`;

      if (visited.has(key) || !isPointWalkable(next, map, margin)) {
        continue;
      }

      visited.add(key);
      queue.push(next);
    }
  }

  return false;
}

export function isStarReachable(star, map) {
  const { starSafeMargin } = getWalkabilityConfig(map);
  return isPointReachable(star, map, starSafeMargin);
}

export function isStarPlacementValid(star, map) {
  const { starSafeMargin } = getWalkabilityConfig(map);
  return isPointWalkable(star, map, starSafeMargin) && isStarReachable(star, map);
}

export function findNearestWalkablePoint(point, map) {
  const { starSafeMargin, fallbackStep, fallbackMaxRadius } = getWalkabilityConfig(map);
  let bestPoint = null;
  let bestDistance = Infinity;

  if (isPointWalkable(point, map, starSafeMargin)) {
    return { x: point.x, y: point.y };
  }

  for (let radius = fallbackStep; radius <= fallbackMaxRadius; radius += fallbackStep) {
    for (let dx = -radius; dx <= radius; dx += fallbackStep) {
      for (let dy = -radius; dy <= radius; dy += fallbackStep) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
          continue;
        }

        const candidate = {
          x: Math.round(point.x + dx),
          y: Math.round(point.y + dy),
        };

        if (!isPointWalkable(candidate, map, starSafeMargin) || !isPointReachable(candidate, map, starSafeMargin)) {
          continue;
        }

        const distance = distanceBetween(point, candidate);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPoint = candidate;
        }
      }
    }

    if (bestPoint) {
      return bestPoint;
    }
  }

  return { x: map.spawn.x, y: map.spawn.y };
}

export function validateStarPlacements(map) {
  return map.stars.map((star) => {
    const valid = isStarPlacementValid(star, map);
    const resolved = valid ? { x: star.x, y: star.y } : findNearestWalkablePoint(star, map);

    return {
      id: star.id,
      valid,
      original: { x: star.x, y: star.y },
      resolved,
    };
  });
}

export function resolveStarPlacements(map) {
  const validations = validateStarPlacements(map);

  return map.stars.map((star) => {
    const validation = validations.find((item) => item.id === star.id);
    return {
      ...star,
      x: validation.resolved.x,
      y: validation.resolved.y,
      originalX: star.x,
      originalY: star.y,
      placementAdjusted: !validation.valid,
    };
  });
}

export function warnInvalidStarPlacements(map, resolvedStars) {
  if (!import.meta.env.DEV) {
    return;
  }

  resolvedStars
    .filter((star) => star.placementAdjusted)
    .forEach((star) => {
      console.warn(
        `[forestMap] Star ${star.id} was on an unwalkable area and was moved from (${star.originalX}, ${star.originalY}) to (${star.x}, ${star.y}).`,
      );
    });
}

export function getNearbyStar(player, map, collected) {
  const stars = map.resolvedStars ?? map.stars;

  return stars.find((star) => {
    if (collected.has(star.id)) {
      return false;
    }

    return distanceBetween(player, star) <= STAR.collectRadius;
  });
}

export function isStarGlowing(player, star) {
  return distanceBetween(player, star) <= STAR.glowRadius;
}
