import { useEffect, useMemo, useState } from 'react';
import OpeningScene from './components/OpeningScene.jsx';
import ForestGame from './components/ForestGame.jsx';
import CollectibleCard from './components/CollectibleCard.jsx';
import EndingScene from './components/EndingScene.jsx';
import GiftReveal from './components/GiftReveal.jsx';
import AudioToggle from './components/AudioToggle.jsx';
import story from './data/story.json';
import collectibles from './data/collectibles.json';
import {
  collectStar,
  createInitialCollectedState,
  getCollectibleById,
  getProgress,
} from './game/gameState.js';

const APP_STATES = {
  loading: 'loading',
  opening: 'opening',
  forest: 'forest',
  card: 'card',
  ending: 'ending',
  giftReveal: 'giftReveal',
};

export default function App() {
  const [appState, setAppState] = useState(APP_STATES.loading);
  const [collected, setCollected] = useState(() => createInitialCollectedState());
  const [activeCollectibleId, setActiveCollectibleId] = useState(null);

  const progress = useMemo(() => getProgress(collected, collectibles.length), [collected]);
  const activeCollectible = activeCollectibleId
    ? getCollectibleById(collectibles, activeCollectibleId)
    : null;

  useEffect(() => {
    const timer = window.setTimeout(() => setAppState(APP_STATES.opening), 700);
    return () => window.clearTimeout(timer);
  }, []);

  function handleCollect(starId) {
    if (collected.has(starId)) {
      return;
    }

    setCollected((current) => collectStar(current, starId));
    setActiveCollectibleId(starId);
    setAppState(APP_STATES.card);
  }

  function closeCard() {
    setActiveCollectibleId(null);
    setAppState(progress.isComplete ? APP_STATES.ending : APP_STATES.forest);
  }

  return (
    <main className="app-shell">
      <AudioToggle />

      {appState === APP_STATES.loading ? (
        <section className="loading-screen" aria-label="Loading">
          <div className="loading-star" aria-hidden="true" />
          <p>Loading a tiny birthday forest...</p>
        </section>
      ) : null}

      {appState === APP_STATES.opening ? (
        <OpeningScene story={story} onStart={() => setAppState(APP_STATES.forest)} />
      ) : null}

      {appState === APP_STATES.forest || appState === APP_STATES.card ? (
        <>
          <ForestGame
            collectibles={collectibles}
            collected={collected}
            progress={progress}
            paused={appState === APP_STATES.card}
            onCollect={handleCollect}
          />
          {activeCollectible ? (
            <CollectibleCard
              collectible={activeCollectible}
              isFinal={progress.isComplete}
              onClose={closeCard}
            />
          ) : null}
        </>
      ) : null}

      {appState === APP_STATES.ending ? (
        <EndingScene story={story} onComplete={() => setAppState(APP_STATES.giftReveal)} />
      ) : null}

      {appState === APP_STATES.giftReveal ? <GiftReveal lines={story.finalFinalEnding} /> : null}
    </main>
  );
}
