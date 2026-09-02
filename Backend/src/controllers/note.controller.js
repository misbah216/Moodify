const noteModel = require('../models/note.model');

async function createNote(req, res) {
    const content = req.body.content?.trim();

    if (!content) {
        return res.status(400).json({ message: 'Note content is required' });
    }

    const note = await noteModel.create({
        user: req.user.id,
        content
    });

    return res.status(201).json({
        message: 'Note saved successfully',
        note
    });
}

async function getNotes(req, res) {
    const notes = await noteModel.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
        message: 'Notes fetched successfully',
        notes
    });
}

module.exports = { createNote, getNotes };