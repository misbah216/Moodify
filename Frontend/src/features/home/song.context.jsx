import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({children})=>{
    const [playlist, setPlaylist] = useState([])
    const [currentSong, setCurrentSong] = useState(null)
    const [activeMood, setActiveMood] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const playNext = () => {
        if (currentIndex >= playlist.length - 1) return

        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setCurrentSong(playlist[nextIndex])
    }

    const selectSong = (index) => {
        setCurrentIndex(index)
        setCurrentSong(playlist[index])
    }

    return (
        <SongContext.Provider
            value={{ loading, setLoading, currentSong, setCurrentSong, playlist, setPlaylist, activeMood, setActiveMood, currentIndex, setCurrentIndex, playNext, selectSong }}
        >
        {children}
        </SongContext.Provider>

    )
}