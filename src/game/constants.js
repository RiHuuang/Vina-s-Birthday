export const VIEWPORT_WIDTH = 360;
export const VIEWPORT_HEIGHT = 610;

export function publicAsset(path) {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith('./') || path.startsWith('../')) return path;

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}

export const PLAYER = {
  width: 30,
  height: 38,
  collisionWidth: 22,
  collisionHeight: 18,
  speed: 156,
};

export const STAR = {
  size: 26,
  collectRadius: 34,
  glowRadius: 96,
};

export const ASSETS = {
  sprites: {
    player: publicAsset('/assets/sprites/player.png'),
    star: publicAsset('/assets/sprites/star.png'),
    sparkle: publicAsset('/assets/sprites/sparkle.png'),
    firefly: publicAsset('/assets/sprites/firefly.png'),
    cloud: publicAsset('/assets/sprites/cloud.png'),
  },
  tiles: {
    grass: publicAsset('/assets/tiles/grass.png'),
    path: publicAsset('/assets/tiles/path.png'),
    tree: publicAsset('/assets/tiles/tree.png'),
    bush: publicAsset('/assets/tiles/bush.png'),
    flower: publicAsset('/assets/tiles/flower.png'),
    rock: publicAsset('/assets/tiles/rock.png'),
    water: publicAsset('/assets/tiles/water.png'),
  },
  backgrounds: {
    forest: publicAsset('/assets/backgrounds/forest.png'),
    nightForest: publicAsset('/assets/backgrounds/night-forest.png'),
    endingSky: publicAsset('/assets/backgrounds/ending-sky.png'),
  },
  cards: {
    fallback: publicAsset('/assets/cards/fallback-card.png'),
  },
  audio: {
    bgm: publicAsset('/assets/audio/bgm-flowerbed-fields.ogg'),
    collect: publicAsset('/assets/audio/collect.wav'),
    cardOpen: publicAsset('/assets/audio/card-open.wav'),
    success: publicAsset('/assets/audio/success.wav'),
  },
};
