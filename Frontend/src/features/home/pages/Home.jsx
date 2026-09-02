import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/player";
import { useSong } from '../hooks/useSong';
import { AuthContext } from '../../auth/auth.context';
import MoodTracker from '../components/MoodTracker';
import MusicAnalytics from '../components/MusicAnalytics';
import { saveNote } from '../service/notes.api';
import { deleteFavorite, getFavorites, saveFavorite } from '../service/song.api';
import ExplorePlaylists from '../components/ExplorePlaylists';
import '../style/home.css';

const HEADER_EMOJIS = [
  { emoji: '😊', left: '8%', top: '18%', delay: '0s' },
  { emoji: '🎧', left: '24%', top: '58%', delay: '1s' },
  { emoji: '😮', left: '42%', top: '12%', delay: '2s' },
  { emoji: '🎵', left: '62%', top: '56%', delay: '0.5s' },
  { emoji: '🥰', left: '82%', top: '20%', delay: '1.5s' },
  { emoji: '🎶', left: '92%', top: '62%', delay: '2.5s' },
];

const PLAYLIST_TAGLINES = {
  happy: 'Aaj to Malik khush hain',
  sad: 'zindagi hai , hota hai',
  surprised: 'Kyuu, chaunk gye',
};

const getSongKey = (song) => song.externalId || song.id || song._id || song.url || `${song.title}-${song.artist || song.mood}`;

function Home() {
  const { handleGetSong, currentSong, playlist, activeMood, currentIndex, playNext, selectSong, loading } = useSong();
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [width, setWidth] = useState(350);
  const [showLogout, setShowLogout] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [previousMood, setPreviousMood] = useState(null);
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [journalNote, setJournalNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteError, setNoteError] = useState('');
  const lastPlaybackTimeRef = useRef(0);
  const playedSongsRef = useRef(new Set());
  const currentMoodRef = useRef(null);
  const cameraCleanupRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    getFavorites()
      .then((data) => {
        if (!cancelled) setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
      })
      .catch(() => {
        if (!cancelled) setFavorites([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    lastPlaybackTimeRef.current = 0;
  }, [currentSong?.streamUrl, currentSong?.url]);

  const handleMoodDetected = (mood) => {
    if (!mood) return;

    const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
    const previousDetectedMood = currentMoodRef.current;

    setPreviousMood(previousDetectedMood || null);
    currentMoodRef.current = normalizedMood;
    setCurrentMood(normalizedMood);
    void handleGetSong(mood);
  };

  const handleCameraView = () => {
    cameraCleanupRef.current?.();
    setIsDetected(false);
    setCurrentExpression(null);
  };

  const handleDetectAgain = (detected) => {
    if (detected) {
      setIsDetected(true);
      return;
    }

    handleCameraView();
  };

  const handlePlaybackStart = () => {
    const streamUrl = currentSong?.streamUrl || currentSong?.url;
    if (!streamUrl || playedSongsRef.current.has(streamUrl)) return;

    playedSongsRef.current.add(streamUrl);
    setSongsPlayed((count) => count + 1);
  };

  const handlePlaybackTime = (time) => {
    const previousTime = lastPlaybackTimeRef.current;
    const elapsed = time - previousTime;

    if (elapsed > 0 && elapsed <= 2) {
      setListeningSeconds((seconds) => seconds + elapsed);
    }

    lastPlaybackTimeRef.current = time;
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const toggleFavorite = async (song) => {
    const songKey = getSongKey(song);
    const isFavorite = favorites.some((favorite) => getSongKey(favorite) === songKey);

    try {
      if (isFavorite) {
        await deleteFavorite(song);
        setFavorites((currentFavorites) => currentFavorites.filter((favorite) => getSongKey(favorite) !== songKey));
        return;
      }

      const data = await saveFavorite(song);
      const favorite = data.favorite || song;
      setFavorites((currentFavorites) => currentFavorites.some((item) => getSongKey(item) === songKey)
        ? currentFavorites
        : [...currentFavorites, favorite]);
    } catch {
      return;
    }
  };

  const saveJournalNote = async () => {
    if (!journalNote.trim()) return;

    setSavingNote(true);
    setNoteError('');
    try {
      await saveNote(journalNote);
      setSavedNote(journalNote);
      setJournalNote('');
    } catch {
      setNoteError('Unable to save your note.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 280 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="home-page" style={{ display: 'flex', gap: '20px', padding: '20px', paddingTop: '94px', width: '100%', boxSizing: 'border-box' }}>
      <header className="home-header">
        <div className="home-header__emojis" aria-hidden="true">
          {HEADER_EMOJIS.map(({ emoji, left, top, delay }) => (
            <span key={`${emoji}-${left}`} className="home-header__emoji" style={{ left, top, animationDelay: delay }}>{emoji}</span>
          ))}
        </div>
        <div className="home-header__brand">
          <div style={{ marginRight: '100px' }}>
              <ExplorePlaylists />
          </div>
          <svg className="home-header__tagline" viewBox="0 0 340 56" role="img" aria-label="Naya ho purana bas bajna chahiye gaana">
            <defs>
              <path id="header-tagline-curve" d="M 4 38 Q 85 2 170 28 T 336 22" />
            </defs>
            
            <text>
              <textPath href="#header-tagline-curve">Naya ho purana bas bajna chahiye gaana</textPath>
            </text>
          </svg>
          <h1 className="home-header__title">Moodify</h1>
          
        </div>
        <div className="home-header__profile" aria-label={`Profile for ${user?.username || 'User'}`}>
        <button
          type="button"
          className="home-header__profile-button"
          aria-label="Open profile menu"
          onClick={() => setShowLogout((isOpen) => !isOpen)}
          style={{ zIndex: 10, pointerEvents: 'auto' }}
        >
          ♫
        </button>
        <span className="home-header__username">{user?.username || 'User'}</span>
        {showLogout && (
          <div className="home-header__logout">
            <button type="button" onClick={() => navigate('/saved-notes')}>
              Saved Notes
            </button>
            <button type="button" onClick={handleLogoutClick} style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
              Logout
            </button>
          </div>
        )}
        </div>
      </header>

      <div 
        style={{ 
          width: currentSong ? `${width}px` : 'auto', 
          flex: currentSong ? '0 0 auto' : '1 1 0',
          minWidth: 0,
          position: 'relative', 
          transition: 'none',
          boxSizing: 'border-box',
          paddingRight: '12px'
        }}
      >
        <div style={{ margin: 0, padding: 0 }}>
          <FaceExpression currentExpression={currentExpression} isDetected={isDetected} cleanupRef={cameraCleanupRef} onDetectAgain={handleDetectAgain} onExpressionChange={setCurrentExpression} onMoodChange={handleMoodDetected} />
        </div>
        {currentSong && (
          <div
            className="player-resize-area"
            style={{ marginTop: '10px', width: '100%', position: 'relative' }}
          >
            <Player
              key={getSongKey(currentSong)}
              currentSong={currentSong}
              title={currentSong.title}
              artist={currentSong.artist || currentSong.mood}
              coverImg={currentSong.coverImg}
              poster={currentSong.posterUrl}
              autoPlay
              onEnded={playNext}
              onPlay={handlePlaybackStart}
              onTimeUpdate={handlePlaybackTime}
            />
          </div>
        )}
        {currentSong && (
          <div
            className="home-resize-handle"
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              top: 0,
              right: '-4px',
              width: '10px',
              height: '100%',
              cursor: 'ew-resize',
              zIndex: 10,
              background: 'transparent'
            }}
          />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <aside className="playlist-panel" style={{ marginTop: '12px', padding: '18px', minHeight: '280px', border: '1px solid rgba(255, 105, 180, 0.35)', borderRadius: '14px', background: 'rgba(18, 18, 18, 0.92)', color: '#fff' }}>
          <h2 className="playlist-heading" style={{ margin: 0, color: '#ff69b4' }}>
            {activeMood ? `${activeMood} playlist` : 'Playlist'}
          </h2>
          {loading && <p>Loading playlist...</p>}
          {!loading && playlist.length === 0 && <p>Detect a mood to load songs.</p>}
          <div className="playlist-list" style={{ display: 'grid', gap: '8px' }}>
            {playlist.map((playlistSong, index) => (
              <div className="playlist-song" key={getSongKey(playlistSong)}>
                <button className={`playlist-song__select${index === currentIndex ? ' playlist-song__select--active' : ''}`} type="button" onClick={() => selectSong(index)} aria-label={`Play ${playlistSong.title}`}>
                  <img src={playlistSong.coverImg || playlistSong.posterUrl} alt="" width="42" height="42" />
                  <span>{playlistSong.title}</span>
                </button>
                <button
                  className={`favorite-button${favorites.some((favorite) => getSongKey(favorite) === getSongKey(playlistSong)) ? ' favorite-button--active' : ''}`}
                  type="button"
                  onClick={() => toggleFavorite(playlistSong)}
                  aria-label={`${favorites.some((favorite) => getSongKey(favorite) === getSongKey(playlistSong)) ? 'Remove' : 'Add'} ${playlistSong.title} ${favorites.some((favorite) => getSongKey(favorite) === getSongKey(playlistSong)) ? 'from' : 'to'} favorites`}
                  aria-pressed={favorites.some((favorite) => getSongKey(favorite) === getSongKey(playlistSong))}
                >
                  {favorites.some((favorite) => getSongKey(favorite) === getSongKey(playlistSong)) ? '♥' : '♡'}
                </button>
              </div>
            ))}
          </div>
        </aside>
        {activeMood && PLAYLIST_TAGLINES[activeMood.toLowerCase()] && (
          <p className="mood-tagline">{PLAYLIST_TAGLINES[activeMood.toLowerCase()]}</p>
        )}
        <div className="home-dashboard-row">
          <MoodTracker currentMood={currentMood} previousMood={previousMood} />
          <MusicAnalytics songsPlayed={songsPlayed} listeningSeconds={listeningSeconds} />
        </div>
        <div className="home-personal-row">
          <section className="home-content-card favorites-card">
            <div className="home-content-card__heading">
              <h2>Favorite Songs</h2>
              <span>{favorites.length}</span>
            </div>
            {favorites.length === 0 ? (
              <div className="home-content-card__empty">
                <span aria-hidden="true">♡</span>
                <p>Heart a song to keep it close</p>
              </div>
            ) : (
              <div className="favorites-list">
                {favorites.map((favorite) => (
                  <div className="favorite-song" key={getSongKey(favorite)}>
                    <img src={favorite.coverImg || favorite.posterUrl} alt="" width="44" height="44" />
                    <div>
                      <strong>{favorite.title}</strong>
                      <span>{favorite.artist || favorite.mood || 'Moodify track'}</span>
                    </div>
                    <button className="favorite-button favorite-button--active" type="button" onClick={() => toggleFavorite(favorite)} aria-label={`Remove ${favorite.title} from favorites`}>
                      ♥
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="home-content-card journal-card">
            <div className="home-content-card__heading">
              <h2>Express Your Vibes</h2>
              {savedNote && <span className="journal-status">Saved</span>}
            </div>
            <textarea
              value={journalNote}
              onChange={(event) => setJournalNote(event.target.value)}
              placeholder="Describe your current thoughts or mood..."
              aria-label="Journal note"
            />
            {noteError && <p className="journal-error">{noteError}</p>}
            <button className="journal-save-button" type="button" onClick={saveJournalNote} disabled={savingNote || !journalNote.trim()}>
              {savingNote ? 'Saving...' : 'Save Note'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;