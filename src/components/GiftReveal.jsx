const fallingStars = [
  [8, -6],
  [24, 3],
  [42, -2],
  [60, 8],
  [78, 0],
  [91, 12],
  [15, 18],
  [36, 25],
  [57, 20],
  [82, 30],
  [28, 39],
  [68, 44],
  [10, 54],
  [49, 58],
  [89, 64],
  [21, 73],
  [61, 79],
  [76, 88],
];

const finalFireflies = [
  [11, 28],
  [31, 25],
  [52, 30],
  [74, 27],
  [88, 36],
  [17, 44],
  [42, 47],
  [64, 42],
  [81, 52],
  [24, 58],
  [49, 61],
  [69, 66],
  [13, 71],
  [35, 77],
  [58, 74],
  [84, 81],
  [23, 88],
  [47, 91],
  [67, 87],
  [90, 92],
];

export default function GiftReveal({ lines }) {
  return (
    <section className="gift-reveal" aria-label="Final instruction">
      <div className="gift-moon-glow" aria-hidden="true" />
      <div className="gift-stars" aria-hidden="true">
        {fallingStars.map(([left, top], index) => (
          <span
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * -0.35}s` }}
          />
        ))}
      </div>
      <div className="gift-fireflies" aria-hidden="true">
        {finalFireflies.map(([left, top], index) => (
          <span
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * 0.11}s` }}
          />
        ))}
      </div>
      <div className="heart-burst" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="gift-card">
        <div className="gift-card-shine" aria-hidden="true" />
        {lines.map((line, index) => (
          <p
            key={line}
            className={index === lines.length - 1 ? 'final-instruction-line' : ''}
            style={{ '--line-index': index }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
