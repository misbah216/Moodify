import {createContext}  from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({children})=>{

    const [song , setSong] = useState({

        "url": "https://ik.imagekit.io/1sgcfsz1i/Misbah/moodify/songs/Baliye_Re__320_Kbps__-_www.DownloadMing4.Com_ecd2xamhz.mp3",
        "posterUrl": "https://ik.imagekit.io/1sgcfsz1i/Misbah/moodify/posters/Baliye_Re__320_Kbps__-_www.DownloadMing4.Com__YZ3cmQe_.jpeg",
        "title": "Baliye Re (320 Kbps) - www.DownloadMing4.Com",
        "mood": "sad",

    })

    const[loading , setLoading ]  = useState(false)

    return (
        <SongContext.Provider
            value={{loading , setLoading , song , setSong}}
        >
        {children}
        </SongContext.Provider>

    )
}