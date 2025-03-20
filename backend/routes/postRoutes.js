import express from "express"
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get('/feed',protectRoute,getFeedPosts);
router.get('/:id',getPost);
router.get('/user/:username',getUserPosts);
router.post('/create',protectRoute,createPost);
router.delete('/:id',protectRoute, deletePost);
router.post('/like/:postId',protectRoute, likeUnlikePost);
router.post('/reply/:postId',protectRoute, replyToPost);

export default router ;