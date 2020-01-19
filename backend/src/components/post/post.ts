import {Router} from "express";
import path from "path";
import {createPost, dislikePost, getPosts, likePost, removeLikeOrDislikeFromPost} from "./postService";
import authenticate from "../../middlewares/authenticate";
import {createPostValidationRules, likePostValidationRules, validate} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import endpoints from "../../utils/constants/endpoints";
import multer from "multer"
import {cloudinary, uploader} from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";
import {AppError} from "../../utils/errors/AppError";


const storage = cloudinaryStorage({
    cloudinary,
    folder: 'postImages',
    allowedFormats: ['jpg', 'png', "jpeg"],
    filename: function (req, file, cb) {
        cb(null, file.originalname.substring(0, file.originalname.length - 4) + '-' + Date.now())
    }
    //transformation: [{ width: 500, height: 500, crop: 'limit' }]
});
const parser = multer({storage});
const maxImagesPerUpload = 10;
const multerUploads = parser.array('image', maxImagesPerUpload);

const router = Router();

router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    const post = await createPost(req.userId, content.type, content.text);
    res.status(httpCodes.CREATED).send(post);
}));


router.post('/imageposts', authenticate, multerUploads, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    if (!req.files)
        throw new AppError(httpCodes.BAD_REQUEST, 'Image not provided error', 'Image was not successfully uploaded');
    const imageUrls = req.files.map(file => file.url);
    const post = await createPost(req.userId, content.type, content.text, imageUrls);
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