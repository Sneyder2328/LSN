import {Router} from "express";
import {createPost, dislikePost, getPosts, likePost, removeLikeOrDislikeFromPost} from "./postService";
import authenticate from "../../middlewares/authenticate";
import {createPostValidationRules, likePostValidationRules, validate} from "../../middlewares/validate";
import {handleErrorAsync} from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import endpoints from "../../utils/constants/endpoints";
import multer from "multer"
import {cloudinary} from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";
import {AppError} from "../../utils/errors/AppError";
import {MAX_IMG_FILE_SIZE, MAX_IMGS_PER_UPLOAD} from "../../utils/constants";


const storage = cloudinaryStorage({
    cloudinary,
    folder: 'postImages',
    allowedFormats: ['jpg', 'png', "jpeg"],
    filename: function (req, file, cb) {
        cb(null, file.originalname.substring(0, file.originalname.length - 4) + '-' + Date.now())
    },
    transformation: [{width: 960, height: 960, crop: 'limit'}]
});
const parser = multer({
    storage,
    limits: {fileSize: MAX_IMG_FILE_SIZE}
});
const multerUploads = parser.array('image', MAX_IMGS_PER_UPLOAD);

const router = Router();

router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    const post = await createPost(content.id, req.userId, content.type, content.text);
    res.status(httpCodes.CREATED).send(post);
}));


router.post('/imageposts', authenticate, multerUploads, createPostValidationRules, validate, handleErrorAsync(async (req, res) => {
    const content = req.body;
    if (!req.files)
        throw new AppError(httpCodes.BAD_REQUEST, 'Image not provided error', 'Image was not successfully uploaded');
    const imageUrls = req.files.map(file => file.url);
    const post = await createPost(content.id, req.userId, content.type, content.text, imageUrls);
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