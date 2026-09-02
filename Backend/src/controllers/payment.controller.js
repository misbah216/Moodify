const userModel = require("../models/user.model");

async function unlockPlaylist(req, res) {
    try {
        const { playlistName, paymentId } = req.body;
        const userId = req.user.id;

        console.log("Unlock request:", { userId, playlistName, paymentId });

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { unlockedPlaylists: playlistName } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Playlist unlocked",
            unlockedPlaylists: user.unlockedPlaylists,
            paymentId
        });
    } catch (error) {
        console.error("Unlock playlist error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { unlockPlaylist };