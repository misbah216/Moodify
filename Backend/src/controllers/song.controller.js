const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

async function uploadSong(req,res){
    const songBuffer = req.file.buffer
    const {mood} = req.body
    const normalizedMood = normalizeMood(mood)


    const tags = id3.read(songBuffer)

    
    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer : songBuffer,
            filename : tags.title+ ".mp3",
            folder : "/Misbah/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename : tags.title + ".jpeg",
            folder : "/Misbah/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title :tags.title,
        url : songFile.url,
        posterUrl : posterFile.url,
        mood: normalizedMood

    })

    res.status(201).json({
        message :"song created successfully",
        song
    })
}

async function getSongs(req,res){
    const mood = normalizeMood(req.query.mood)
    const songs = await songModel.find(mood ? { mood: new RegExp(`^${mood}$`, "i") } : {}).sort({ _id: 1 })
    const normalizedSongs = songs.map((song) => ({
        ...song.toObject(),
        mood: normalizeMood(song.mood)
    }))

    res.status(200).json({
        message:"songs fetched successfully.",
        songs: normalizedSongs,
    })
}

function normalizeMood(mood) {
    if (!mood) return undefined

    const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()
    return ["Happy", "Sad", "Surprised"].includes(normalizedMood) ? normalizedMood : undefined
}

module.exports = {uploadSong , getSongs}