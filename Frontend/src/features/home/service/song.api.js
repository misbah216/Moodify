import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

function decodeHtmlEntities(value) {
    if (!value || typeof document === "undefined") return value || "";
    const element = document.createElement("textarea");
    element.innerHTML = value;
    return element.value;
}

function normalizeSong(song) {
    return {
        ...song,
        title: decodeHtmlEntities(song.title),
        artist: decodeHtmlEntities(song.artist),
        coverImg: song.coverImg || song.imageUrl || song.posterUrl || "",
        streamUrl: song.streamUrl || song.url || "",
    };
}

export async function getCuratedPlaylist(mood) {
    const normalizedMood = mood.toLowerCase();
    const response = await api.get(`/api/songs?mood=${normalizedMood}`);
    const songsData = Array.isArray(response.data) ? response.data : (response.data.songs || []);
    return songsData.map(normalizeSong);
}

export async function getFavorites() {
    const response = await api.get("/api/songs/favorites");
    return {
        ...response.data,
        favorites: Array.isArray(response.data.favorites) ? response.data.favorites.map(normalizeSong) : [],
    };
}

export async function saveFavorite(song) {
    const response = await api.post("/api/songs/favorites", song);
    return response.data;
}

export async function deleteFavorite(song) {
    const favoriteId = song.externalId || song.id;
    await api.delete(`/api/songs/favorites/${encodeURIComponent(favoriteId)}`);
}