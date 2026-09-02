const express = require("express")
const upload = require("../middlewares/upload.middleware")
const songController = require("../controllers/song.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/",upload.single("song"), songController.uploadSong)

router.get("/",songController.getSongs)
router.get("/favorites", authMiddleware.authUser, songController.getFavorites)
router.post("/favorites", authMiddleware.authUser, songController.addFavorite)
router.delete("/favorites/:id", authMiddleware.authUser, songController.removeFavorite)


module.exports = router