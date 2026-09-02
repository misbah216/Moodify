const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');




const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use('/songs', express.static(path.join(__dirname, '../../songs')))

const authRoutes = require("./routes/auth.routes.js")
const songRoutes = require("./routes/song.routes")
const noteRoutes = require("./routes/note.routes")
const paymentRoutes = require("./routes/payment.routes");


app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes)
app.use("/api/notes", noteRoutes)
app.use("/payment", paymentRoutes);

module.exports = app;