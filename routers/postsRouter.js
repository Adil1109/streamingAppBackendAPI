const express = require('express');

const router = express.Router();
const postsController = require('../controllers/postsController');

const { identifier } = require('../middlewares/identification');

router.get('/get-posts', postsController.getPosts);
router.get('/get-post/:_id', postsController.getPost);
router.get('/search/:_term', postsController.searchPost);
router.post('/create-post', identifier, postsController.createPost);
router.patch('/update-post/:_id', identifier, postsController.updatePost);
router.delete('/delete-post/:_id', identifier, postsController.deletePost);

module.exports = router;
