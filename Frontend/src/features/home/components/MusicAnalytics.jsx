function formatListeningTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}:${seconds}`;
}

export default function MusicAnalytics({ songsPlayed, listeningSeconds }) {
  return (
    <section className="home-dashboard-card music-analytics" aria-label="Music analytics">
      <div className="home-dashboard-card__heading">
        <span className="home-dashboard-card__eyebrow">Music Analytics</span>
        <span className="home-dashboard-card__pulse" />
      </div>
      <div className="music-analytics__stats">
        <div>
          <strong>{songsPlayed}</strong>
          <span>Songs played</span>
        </div>
        <div>
          <strong>{formatListeningTime(listeningSeconds)}</strong>
          <span>Listening time</span>
        </div>
      </div>
    </section>
  );
}
