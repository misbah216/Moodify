const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/unlock", authUser, paymentController.unlockPlaylist);

module.exports = router;