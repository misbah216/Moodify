const express = require('express');
const noteController = require('../controllers/note.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.authUser);
router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);

module.exports = router;