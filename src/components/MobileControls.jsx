const directions = [
  { key: 'up', label: '▲', aria: 'Move up', className: 'dpad-up' },
  { key: 'left', label: '◀', aria: 'Move left', className: 'dpad-left' },
  { key: 'right', label: '▶', aria: 'Move right', className: 'dpad-right' },
  { key: 'down', label: '▼', aria: 'Move down', className: 'dpad-down' },
];

function ControlButton({ direction, label, aria, className, onPress, onRelease }) {
  return (
    <button
      className={`control-button ${className}`}
      type="button"
      aria-label={aria}
      onPointerDown={(event) => {
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture?.(event.pointerId);
        } catch {
          // Synthetic pointer events used in automated checks may not be capturable.
        }
        onPress(direction);
      }}
      onPointerUp={(event) => {
        event.preventDefault();
        onRelease(direction);
      }}
      onPointerCancel={() => onRelease(direction)}
      onPointerLeave={() => onRelease(direction)}
    >
      {label}
    </button>
  );
}

export default function MobileControls({ onPress, onRelease, onInteract, nearby }) {
  return (
    <div className="mobile-controls" aria-label="Forest controls">
      <div className="dpad">
        {directions.map((control) => (
          <ControlButton
            key={control.key}
            direction={control.key}
            label={control.label}
            aria={control.aria}
            className={control.className}
            onPress={onPress}
            onRelease={onRelease}
          />
        ))}
      </div>
      <button
        className={`interact-button ${nearby ? 'is-ready' : ''}`}
        type="button"
        aria-label="Collect nearby star"
        onClick={onInteract}
      >
        ★
      </button>
    </div>
  );
}
