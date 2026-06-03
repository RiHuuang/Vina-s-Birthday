import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MobileControls from './MobileControls.jsx';
import ProgressHud from './ProgressHud.jsx';
import { PLAYER, STAR, VIEWPORT_HEIGHT, VIEWPORT_WIDTH, ASSETS } from '../game/constants.js';
import { getPlayerCollisionBox } from '../game/collision.js';
import { getCamera, getForestMap } from '../game/forestMap.js';
import { movePlayer } from '../game/playerMovement.js';
import {
  getNearbyStar,
  isStarGlowing,
  resolveStarPlacements,
  warnInvalidStarPlacements,
} from '../game/starPlacement.js';

const fireflies = [
  [9, 12],
  [33, 17],
  [72, 13],
  [86, 28],
  [18, 34],
  [54, 31],
  [77, 45],
  [27, 52],
  [63, 59],
  [88, 66],
  [12, 72],
  [43, 77],
  [69, 82],
  [31, 88],
  [81, 91],
  [53, 42],
];

function SpriteImage({ src, className, alt = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      className={className}
      alt={alt}
      draggable="false"
      onDragStart={(event) => event.preventDefault()}
      onError={() => setFailed(true)}
    />
  );
}

function getDecorationAsset(type) {
  if (type === 'flowers') return ASSETS.tiles.flower;
  if (type === 'pond') return ASSETS.tiles.water;
  return ASSETS.tiles[type];
}

export default function ForestGame({ collectibles, collected, progress, paused, onCollect }) {
  const map = useMemo(() => {
    const baseMap = getForestMap();
    const resolvedStars = resolveStarPlacements(baseMap);
    return { ...baseMap, resolvedStars };
  }, []);
  const [viewport, setViewport] = useState({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, scale: 1 });
  const [player, setPlayer] = useState({
    x: map.spawn.x,
    y: map.spawn.y,
    facing: 'down',
    moving: false,
  });

  const inputRef = useRef({ up: false, down: false, left: false, right: false });
  const playerRef = useRef(player);
  const pausedRef = useRef(paused);
  const collectedRef = useRef(collected);
  const onCollectRef = useRef(onCollect);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);

  useEffect(() => {
    onCollectRef.current = onCollect;
  }, [onCollect]);

  useEffect(() => {
    function updateViewport() {
      const availableWidth = Math.min(window.innerWidth - 20, 430);
      const availableHeight = (window.visualViewport?.height ?? window.innerHeight) - 122;
      const scale = Math.max(0.76, Math.min(availableWidth / VIEWPORT_WIDTH, availableHeight / VIEWPORT_HEIGHT, 1.18));
      setViewport({
        width: Math.round(availableWidth / scale),
        height: Math.round(Math.max(430, availableHeight / scale)),
        scale,
      });
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
    };
  }, []);

  const nearbyStar = useMemo(() => getNearbyStar(player, map, collected), [player, map, collected]);
  const camera = getCamera(player, map, viewport);

  useEffect(() => {
    warnInvalidStarPlacements(map, map.resolvedStars);
  }, [map]);

  const pressDirection = useCallback((direction) => {
    inputRef.current[direction] = true;
  }, []);

  const releaseDirection = useCallback((direction) => {
    inputRef.current[direction] = false;
  }, []);

  const collectNearby = useCallback(() => {
    const star = getNearbyStar(playerRef.current, map, collectedRef.current);
    if (star) {
      inputRef.current = { up: false, down: false, left: false, right: false };
      onCollectRef.current(star.id);
    }
  }, [map]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') inputRef.current.up = true;
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') inputRef.current.down = true;
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = true;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = true;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        collectNearby();
      }
    }

    function handleKeyUp(event) {
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') inputRef.current.up = false;
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') inputRef.current.down = false;
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = false;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [collectNearby]);

  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    function tick(now) {
      const delta = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;

      if (!pausedRef.current) {
        const next = movePlayer(playerRef.current, inputRef.current, delta, map);
        playerRef.current = next;
        setPlayer(next);
      }

      frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [map]);

  return (
    <section className="forest-game" aria-label="Romantic pixel forest">
      <div
        className="forest-frame"
        style={{ width: `${viewport.width * viewport.scale}px`, height: `${viewport.height * viewport.scale}px` }}
      >
        <div
          className="forest-viewport"
          style={{
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
            transform: `scale(${viewport.scale})`,
          }}
        >
          <div
            className="forest-world"
            style={{
              width: `${map.width}px`,
              height: `${map.height}px`,
              transform: `translate(${-camera.x}px, ${-camera.y}px)`,
            }}
          >
            <SpriteImage src={ASSETS.backgrounds.forest} className="forest-bg-img" />
            <div className="forest-path main-path" />
            <div className="forest-path branch-path" />
            {map.landmarks.map((landmark) => (
              <div
                key={landmark.id}
                className={`landmark landmark-${landmark.type}`}
                style={{
                  left: `${landmark.x - landmark.width / 2}px`,
                  top: `${landmark.y - landmark.height / 2}px`,
                  width: `${landmark.width}px`,
                  height: `${landmark.height}px`,
                }}
                aria-label={landmark.label}
              />
            ))}

            {map.decorations.map((item) => (
              <div
                key={item.id}
                className={`forest-decoration decoration-${item.type}`}
                style={{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }}
              >
                <SpriteImage src={getDecorationAsset(item.type)} className="tile-img" />
              </div>
            ))}

            {map.resolvedStars.map((star) => {
              const item = collectibles.find((collectible) => collectible.id === star.id);
              const found = collected.has(star.id);
              const glowing = isStarGlowing(player, star);
              return (
                <button
                  key={star.id}
                  className={`forest-star ${found ? 'is-found' : ''} ${glowing ? 'is-glowing' : ''}`}
                  type="button"
                  disabled={found || paused}
                  aria-label={`${item?.title || `Star ${star.id}`} hidden star`}
                  onClick={() => onCollect(star.id)}
                  style={{ left: `${star.x - STAR.size / 2}px`, top: `${star.y - STAR.size / 2}px` }}
                >
                  <SpriteImage src={ASSETS.sprites.star} className="sprite-img" />
                </button>
              );
            })}

            <div
              className={`forest-player facing-${player.facing} ${player.moving ? 'is-moving' : ''}`}
              style={{ left: `${player.x - PLAYER.width / 2}px`, top: `${player.y - PLAYER.height + 8}px` }}
            >
              <SpriteImage src={ASSETS.sprites.player} className="sprite-img" />
            </div>

            <div
              className="player-collider-debug"
              hidden
              style={{
                left: `${getPlayerCollisionBox(player, PLAYER).x}px`,
                top: `${getPlayerCollisionBox(player, PLAYER).y}px`,
                width: `${PLAYER.collisionWidth}px`,
                height: `${PLAYER.collisionHeight}px`,
              }}
            />
          </div>
          <div className="mist-layer" aria-hidden="true" />
          <div className="firefly-layer" aria-hidden="true">
            {fireflies.map(([left, top], index) => (
              <span
                key={`${left}-${top}`}
                style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * 0.12}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <ProgressHud
        collectedCount={progress.collectedCount}
        total={progress.total}
        nearbyHint={nearbyStar ? 'A birthday star is close. Tap ★' : ''}
      />
      <MobileControls
        onPress={pressDirection}
        onRelease={releaseDirection}
        onInteract={collectNearby}
        nearby={Boolean(nearbyStar)}
      />
    </section>
  );
}
