const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const noteModel = mongoose.model('Note', noteSchema);
module.exports = noteModel;