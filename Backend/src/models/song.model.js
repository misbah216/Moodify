const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    externalId: {
        type: String
    },
    artist: {
        type: String
    },
    source: {
        type: String,
        enum: ['upload', 'jiosaavn'],
        default: 'upload'
    },
    streamUrl: {
        type: String
    },
    streamUrls: {
        type: [String],
        default: []
    },
    url :{
        type : String,
        required : true
    },
    posterUrl: {
        type: String ,
        required: true
    },
    title :{
        type: String,
        required : true
    },
    mood:{
        type : String ,
        enum:{
            values : ["Happy", "Sad", "Surprised"],
            message :"Enum this is"
        }
    }
})

songSchema.index({ user: 1, externalId: 1 }, { unique: true, sparse: true })

const songModel = mongoose.model("songs", songSchema)

module.exports = songModel