const express = require('express');
const auth = require('../middleware/auth');
const CommentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', CommentController.getAllComments);
router.post('/', auth, CommentController.createComment);
router.put('/:id', auth, CommentController.updateComment);
router.delete('/:id', auth, CommentController.deleteComment);
router.post('/:id/reaction', auth, CommentController.addReaction);
router.delete('/:id/reaction', auth, CommentController.removeReaction);
router.get('/:id/reaction', auth, CommentController.getUserReaction);

module.exports = router;
