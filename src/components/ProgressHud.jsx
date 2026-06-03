export default function ProgressHud({ collectedCount, total, nearbyHint }) {
  return (
    <div className="progress-hud" aria-live="polite">
      <div className="progress-count">{collectedCount} / {total} stars</div>
      <div className="progress-hint">{nearbyHint || 'Explore the glowing forest'}</div>
    </div>
  );
}
