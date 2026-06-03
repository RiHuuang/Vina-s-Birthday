import { useEffect, useRef, useState } from 'react';
import { ASSETS } from '../game/constants.js';

export default function AudioToggle() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const audio = new Audio(ASSETS.audio.bgm);
    audio.loop = true;
    audio.volume = 0.34;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      if (enabled) {
        audio.pause();
        setEnabled(false);
        return;
      }

      await audio.play();
      setBlocked(false);
      setEnabled(true);
    } catch {
      setBlocked(true);
      setEnabled(false);
    }
  }

  return (
    <button
      className={`audio-toggle ${enabled ? 'is-playing' : ''} ${blocked ? 'is-blocked' : ''}`}
      type="button"
      aria-label={enabled ? 'Pause background music' : 'Play background music'}
      aria-pressed={enabled}
      onClick={toggleAudio}
    >
      <span aria-hidden="true">{enabled ? '♫' : '♪'}</span>
      <span>{enabled ? 'Music on' : 'Music'}</span>
    </button>
  );
}
