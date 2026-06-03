export const VIEWPORT_WIDTH = 360;
export const VIEWPORT_HEIGHT = 610;

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
    player: '/assets/sprites/player.png',
    star: '/assets/sprites/star.png',
    sparkle: '/assets/sprites/sparkle.png',
    firefly: '/assets/sprites/firefly.png',
    cloud: '/assets/sprites/cloud.png',
  },
  tiles: {
    grass: '/assets/tiles/grass.png',
    path: '/assets/tiles/path.png',
    tree: '/assets/tiles/tree.png',
    bush: '/assets/tiles/bush.png',
    flower: '/assets/tiles/flower.png',
    rock: '/assets/tiles/rock.png',
    water: '/assets/tiles/water.png',
  },
  backgrounds: {
    forest: '/assets/backgrounds/forest.png',
    nightForest: '/assets/backgrounds/night-forest.png',
    endingSky: '/assets/backgrounds/ending-sky.png',
  },
  cards: {
    fallback: '/assets/cards/fallback-card.png',
  },
  audio: {
    bgm: '/assets/audio/bgm-flowerbed-fields.ogg',
    collect: '/assets/audio/collect.wav',
    cardOpen: '/assets/audio/card-open.wav',
    success: '/assets/audio/success.wav',
  },
};
