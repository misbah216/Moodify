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
    const mood = normalizeMood(req.query.mood) || "Happy"

    const dbSongs = await songModel.find({ mood }).sort({ createdAt: -1 })

    const formattedDbSongs = dbSongs.map(song => ({
        id: song._id.toString(),
        externalId: song._id.toString(),
        title: song.title,
        artist: song.artist || "Unknown Artist",
        url: song.url || song.streamUrl,
        streamUrl: song.streamUrl || song.url,
        posterUrl: song.posterUrl || song.coverImg,
        mood: song.mood,
        source: 'database'
    }))

    res.status(200).json({
        message:"songs fetched successfully.",
        songs: formattedDbSongs,
    })
}

async function fetchJioSaavnSongs(queries) {
    const results = []
    const seenIds = new Set()

    for (const query of queries) {
        const encodedQuery = encodeURIComponent(query)
        const endpoints = [
            `https://saavn.dev/api/search/songs?query=${encodedQuery}`,
            `https://saavn.sumit.co/api/search/songs?query=${encodedQuery}`,
            `https://www.jiosaavn.com/api.php?__call=search.getResults&p=1&q=${encodedQuery}&_format=json&_marker=0&ctx=web6dot0`
        ]

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint)
                if (!response.ok) continue

                const payload = await response.json()
                const songs = payload.data?.results || payload.data || payload.results || []
                songs.forEach((song) => {
                    if (!seenIds.has(song.id)) {
                        seenIds.add(song.id)
                        results.push(song)
                    }
                })
                break
            } catch {
                continue
            }
        }
    }

    return results
}

async function getFavorites(req, res) {
    const favorites = await songModel.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ favorites })
}

async function addFavorite(req, res) {
    const { id, externalId, title, artist, url, streamUrl, streamUrls, posterUrl, mood } = req.body
    const favoriteId = externalId || id
    const availableStreams = Array.isArray(streamUrls) && streamUrls.length ? streamUrls : [streamUrl || url]
    const selectedStream = streamUrl || availableStreams[0]

    if (!favoriteId || !title || !selectedStream || !posterUrl) {
        return res.status(400).json({ message: "Favorite song details are required" })
    }

    const favorite = await songModel.findOneAndUpdate(
        { user: req.user.id, externalId: String(favoriteId) },
        {
            user: req.user.id,
            externalId: String(favoriteId),
            title,
            artist,
            url: selectedStream,
            streamUrl: selectedStream,
            streamUrls: availableStreams,
            posterUrl,
            mood: normalizeMood(mood),
            source: 'jiosaavn'
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    res.status(201).json({ favorite })
}

async function removeFavorite(req, res) {
    const favoriteId = req.params.id
    await songModel.deleteOne({ user: req.user.id, externalId: favoriteId })
    res.status(204).send()
}

function normalizeJioSaavnSong(song, mood) {
    if (!isHindiSong(song)) return null

    const artist = song.artists?.primary?.map((item) => item.name).join(', ') || song.primaryArtists || song.primary_artists || song.artist || ''
    const streamUrls = getStreamUrls(song)
    const streamUrl = streamUrls[0]
    const posterUrl = song.image?.[song.image.length - 1]?.url || song.image || ''

    return {
        id: String(song.id),
        externalId: String(song.id),
        title: song.name || song.song || song.title,
        artist,
        url: streamUrl,
        streamUrl,
        streamUrls,
        posterUrl,
        mood: normalizeMood(mood),
        source: 'jiosaavn'
    }
}

function getMoodQueries(mood) {
    const queries = {
        Happy: ['Bollywood Happy Songs', 'Hindi Party Hits'],
        Sad: ['Bollywood Sad Songs', 'Hindi Arijit Singh Hits'],
        Surprised: ['Bollywood Upbeat Party', 'Hindi Chartbusters']
    }

    return queries[mood] || queries.Happy
}

function isHindiSong(song) {
    return String(song.language || '').toLowerCase() === 'hindi'
}

function getStreamUrls(song) {
    if (!Array.isArray(song.downloadUrl)) return []

    const validDownloads = song.downloadUrl
        .filter((item) => item?.url && isFullTrackUrl(item.url))
        .map((item) => ({ ...item, url: toHttps(item.url) }))
    const mp3Link = validDownloads.find((item) => item.quality === '320kbps')?.url || validDownloads.slice(-1)[0]?.url
    const remainingStreams = validDownloads
        .map((item) => item.url)
        .filter((url) => url !== mp3Link)

    return [...new Set([mp3Link, ...remainingStreams].filter(Boolean))]
}

function toHttps(url) {
    return String(url).replace(/^http:\/\//i, 'https://')
}

function isFullTrackUrl(url) {
    const normalizedUrl = String(url).toLowerCase()
    return !normalizedUrl.includes('media_preview') && !normalizedUrl.includes('_preview') && !normalizedUrl.includes('preview.saavncdn')
}

function normalizeMood(mood) {
    if (!mood) return undefined

    const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()
    return ["Happy", "Sad", "Surprised"].includes(normalizedMood) ? normalizedMood : undefined
}

module.exports = { uploadSong, getSongs, getFavorites, addFavorite, removeFavorite }