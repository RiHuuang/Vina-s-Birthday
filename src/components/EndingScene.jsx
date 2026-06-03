import { useState } from 'react';
const endingStarPositions = [
  [12, 10],
  [33, 8],
  [55, 12],
  [77, 9],
  [21, 23],
  [45, 25],
  [68, 22],
  [88, 27],
  [13, 39],
  [34, 36],
  [58, 40],
  [79, 37],
  [22, 53],
  [48, 56],
  [70, 52],
  [87, 58],
  [14, 70],
  [36, 74],
  [58, 71],
  [80, 75],
  [29, 86],
  [67, 86],
];

export default function EndingScene({ story, onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const recipient = story.recipientName || '[HER_NAME]';
  const lines = story.ending.map((line) => line.replace('{recipientName}', recipient));
  const isLastLine = lineIndex >= lines.length - 1;

  function advance() {
    if (!isLastLine) {
      setLineIndex((current) => current + 1);
      return;
    }

    onComplete();
  }

  return (
    <section className="ending-scene forest-ending" aria-label="Birthday ending">
      <div className="ending-sky" aria-hidden="true">
        {endingStarPositions.map(([left, top], index) => (
          <span
            key={`${left}-${top}`}
            className="ending-star"
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * 0.07}s` }}
          />
        ))}
      </div>
      <div className="cake-wrap" aria-hidden="true">
        <span className="cake-fallback">22</span>
      </div>
      <div className="story-card ending-card">
        <p>{lines[lineIndex]}</p>
        <button className="pixel-button" type="button" onClick={advance}>
          {isLastLine ? 'One more thing' : 'Next'}
        </button>
      </div>
    </section>
  );
}
