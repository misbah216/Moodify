import { useEffect, useRef, useState } from "react";
import "../../shared/styles/player.scss";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function Player({ currentSong, title = "Now playing", artist = "", poster, image, posterUrl, coverImg, autoPlay = false, onEnded, onPlay, onTimeUpdate }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    const streamUrl = currentSong?.streamUrl;
    if (!audio || !streamUrl) return;

    const playSong = async () => {
      try {
        audio.pause();
        audio.src = streamUrl;
        audio.currentTime = 0;
        audio.load();
        if (autoPlay) await audio.play();
      } catch (error) {
        console.log("Playback:", error);
        setIsPlaying(false);
      }
    };

    playSong();

    return () => audio.pause();
  }, [autoPlay, currentSong?.streamUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Playback:", error);
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const seekBy = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration || 0);
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const changeSpeed = (event) => {
    const value = Number(event.target.value);
    setSpeed(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
  };

  const changeVolume = (event) => {
    const value = Number(event.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const seekTo = (event) => {
    const newTime = Number(event.currentTarget.value);
    if (!audioRef.current || !Number.isFinite(newTime)) return;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <section className="player">
      <img src={coverImg || currentSong?.coverImg || poster || image || posterUrl} alt={title} style={{ display: "block", width: "100%", maxWidth: "100%", height: "auto", maxHeight: "300px", objectFit: "contain", borderRadius: "20px", backgroundColor: "#000" }} />
      <audio
        ref={audioRef}
        src={currentSong?.streamUrl || undefined}
        type="audio/mpeg"
        preload="auto"
        onLoadedMetadata={(event) => {
          setCurrentTime(0);
          setDuration(event.currentTarget.duration);
        }}
        onPlay={() => {
          setIsPlaying(true);
          onPlay?.();
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          setCurrentTime(time);
          onTimeUpdate?.(time);
        }}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={() => {
          console.warn("Audio stream failed:", currentSong?.streamUrl);
          setIsPlaying(false);
        }}
      />
      <div className="player__info">
        <strong>{title}</strong>
        {artist && <span>{artist}</span>}
      </div>
      <div className="player__controls">
        <button type="button" className="player__button" onClick={() => seekBy(-5)} aria-label="Go backward 5 seconds">↶ 5s</button>
        <button type="button" className="player__button player__button--play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>{isPlaying ? "Ⅱ" : "▶"}</button>
        <button type="button" className="player__button" onClick={() => seekBy(5)} aria-label="Go forward 5 seconds">5s ↷</button>
      </div>
      <div className="player__progress">
        <span>{formatTime(currentTime)}</span>
        <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seekTo} onInput={seekTo} aria-label="Playback progress" />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="player__options">
        <label>Speed<select value={speed} onChange={changeSpeed}>{SPEEDS.map((value) => <option key={value} value={value}>{value}x</option>)}</select></label>
        <label>Volume<input type="range" min="0" max="1" step="0.01" value={volume} onChange={changeVolume} aria-label="Volume" /></label>
      </div>
    </section>
  );
}
