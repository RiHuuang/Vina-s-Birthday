import { useState } from 'react';
import { ASSETS, publicAsset } from '../game/constants.js';

const videoExtensions = ['.mp4', '.webm', '.ogg'];

function isVideoPath(path = '') {
  const normalizedPath = path.split('?')[0].toLowerCase();
  return videoExtensions.some((extension) => normalizedPath.endsWith(extension));
}

export default function CollectibleCard({ collectible, onClose, isFinal }) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const starNumber = String(collectible.id).padStart(2, '0');
  const rawMediaPath = collectible.image || ASSETS.cards.fallback;
  const mediaPath = publicAsset(rawMediaPath);
  const isVideo = isVideoPath(rawMediaPath);

  return (
    <div className="card-modal" role="dialog" aria-modal="true" aria-label={collectible.title}>
      <article className={`memory-card ${isFinal ? 'final-memory-card' : ''}`}>
        <div className="card-sparkles" aria-hidden="true" />
        <header className="card-header">
          <span>Star {starNumber}</span>
          <strong>{collectible.rarity}</strong>
        </header>
        <div className="card-image-frame">
          {!mediaFailed && isVideo ? (
            <video
              src={mediaPath}
              controls
              playsInline
              preload="metadata"
              draggable="false"
              onDragStart={(event) => event.preventDefault()}
              onError={() => setMediaFailed(true)}
            />
          ) : null}
          {!mediaFailed && !isVideo ? (
            <img
              src={mediaPath}
              alt=""
              draggable="false"
              onDragStart={(event) => event.preventDefault()}
              onError={() => setMediaFailed(true)}
            />
          ) : null}
          {mediaFailed ? (
            <div className="card-image-fallback" aria-hidden="true">
              <span />
            </div>
          ) : null}
        </div>
        <h2>{collectible.title}</h2>
        <p>{collectible.description}</p>
        <button className="pixel-button" type="button" onClick={onClose}>
          {isFinal ? 'Return the birthday sky' : 'Keep exploring'}
        </button>
      </article>
    </div>
  );
}
