import {Router} from "express";
import {createPost, dislikePost, getPosts, likePost, removeLikeOrDislikeFromPost} from "./postService";
import authenticate from "../../middlewares/authenticate";
import {createPostValidationRules, likePostValidationRules, validate} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import endpoints from "../../utils/constants/endpoints";

const router = Router();

router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text, content.img);
    res.status(httpCodes.CREATED).send(post);
}));

router.get(endpoints.post.GET_POSTS, authenticate, handleErrorAsync(async (req, res) => {
    const posts = await getPosts(req.userId);
    res.status(httpCodes.OK).send(posts);
}));

router.post(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await likePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
}));

router.delete(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await removeLikeOrDislikeFromPost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
}));

router.post(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await dislikePost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
}));

router.delete(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const response = await removeLikeOrDislikeFromPost(req.userId, req.params.postId);
    res.status(httpCodes.OK).send(response);
}));

export default router;