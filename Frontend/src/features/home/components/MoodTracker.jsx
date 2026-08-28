const MOOD_STYLES = {
  Happy: { icon: '😊', color: '#ffca5f' },
  Sad: { icon: '😢', color: '#62b9ff' },
  Surprised: { icon: '😲', color: '#c084fc' },
};

function MoodBadge({ mood, label }) {
  const style = MOOD_STYLES[mood] || { icon: '😐', color: '#9ca3af' };

  return (
    <div className="mood-tracker__mood">
      <span className="mood-tracker__icon" style={{ backgroundColor: `${style.color}22`, color: style.color }}>{style.icon}</span>
      <div>
        <span className="mood-tracker__label">{label}</span>
        <strong style={{ color: style.color }}>{mood || 'Not detected'}</strong>
      </div>
    </div>
  );
}

export default function MoodTracker({ currentMood, previousMood }) {
  return (
    <section className="home-dashboard-card mood-tracker" aria-label="Mood tracker">
      <div className="home-dashboard-card__heading">
        <span className="home-dashboard-card__eyebrow">Mood Tracker</span>
        <span className="home-dashboard-card__pulse" />
      </div>
      <div className="mood-tracker__comparison">
        <MoodBadge mood={previousMood} label="Previous Mood" />
        <span className="mood-tracker__arrow">→</span>
        <MoodBadge mood={currentMood} label="Current Mood" />
      </div>
    </section>
  );
}
