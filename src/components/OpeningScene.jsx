import { useEffect, useState } from 'react';
import { ASSETS } from '../game/constants.js';

export default function OpeningScene({ story, onStart }) {
  const [phase, setPhase] = useState('mist');
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const titleTimer = window.setTimeout(() => setPhase('title'), 2300);
    const storyTimer = window.setTimeout(() => setPhase('story'), 4000);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(storyTimer);
    };
  }, []);

  const isStory = phase === 'story';
  const isLastLine = lineIndex >= story.opening.length - 1;

  function advanceStory() {
    if (!isLastLine) {
      setLineIndex((current) => current + 1);
      return;
    }

    onStart();
  }

  return (
    <section className={`opening-scene opening-${phase}`} aria-label="Opening story">
      <div className="cloud-layer" aria-hidden="true">
        <span className="cloud cloud-a">
          <img
            src={ASSETS.sprites.cloud}
            alt=""
            draggable="false"
            onDragStart={(event) => event.preventDefault()}
          />
        </span>
        <span className="cloud cloud-b">
          <img
            src={ASSETS.sprites.cloud}
            alt=""
            draggable="false"
            onDragStart={(event) => event.preventDefault()}
          />
        </span>
        <span className="cloud cloud-c">
          <img
            src={ASSETS.sprites.cloud}
            alt=""
            draggable="false"
            onDragStart={(event) => event.preventDefault()}
          />
        </span>
      </div>

      <div className="pixel-sparkles" aria-hidden="true" />

      <div className="opening-content">
        <p className="intro-kicker">A tiny forest is waking...</p>
        <h1>{story.title}</h1>

        {isStory ? (
          <div className="story-card">
            <p>{story.opening[lineIndex]}</p>
            <button className="pixel-button" type="button" onClick={advanceStory}>
              {isLastLine ? 'Start Adventure' : 'Next'}
            </button>
          </div>
        ) : (
          <p className="intro-wait">The mist is fading between the trees.</p>
        )}
      </div>
    </section>
  );
}
