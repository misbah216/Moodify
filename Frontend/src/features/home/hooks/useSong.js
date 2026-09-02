import { getCuratedPlaylist } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
  const context = useContext(SongContext);

  const { loading, setLoading, currentSong, setCurrentSong, playlist, setPlaylist, activeMood, setActiveMood, currentIndex, setCurrentIndex, playNext, selectSong } = context;

  async function handleGetSong(mood) {
    setLoading(true);
    try {
      const response = await getCuratedPlaylist(mood);
      const songs = response?.data || response || [];
      const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
      setPlaylist(songs);
      setActiveMood(normalizedMood);
      setCurrentIndex(0);
      setCurrentSong(songs[0] || null);
    } catch {
      setPlaylist([]);
      setCurrentSong(null);
    } finally {
      setLoading(false);
    }
  }

  return { loading, currentSong, playlist, activeMood, currentIndex, handleGetSong, playNext, selectSong };
};