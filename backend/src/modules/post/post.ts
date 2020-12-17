import { Router } from "express";
import {
    createPost,
    dislikePost,
    getPost,
    getPostFromPhoto,
    getPostsByHashtag, getPostsBySection, getTrendingHashtags,
    likePost,
    removeLikeOrDislikeFromPost
} from "./postService";
import authenticate from "../../middlewares/authenticate";
import {
    createPostValidationRules, getPhotoValidationRules,
    getPostValidationRules,
    likePostValidationRules,
    validate
} from "../../middlewares/validate";
import { handleErrorAsync } from "../../middlewares/handleErrorAsync";
import httpCodes from "../../utils/constants/httpResponseCodes";
import endpoints from "../../utils/constants/endpoints";
import multer from "multer"
import { cloudinary } from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";
import { AppError } from "../../utils/errors/AppError";
import { MAX_IMG_FILE_SIZE, MAX_IMGS_PER_UPLOAD } from "../../utils/constants";


const storage = cloudinaryStorage({
    cloudinary,
    folder: 'postImages',
    allowedFormats: ['jpg', 'png', "jpeg"],
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
    transformation: [{ width: 960, height: 960, crop: 'limit' }]
});
const parser = multer({
    storage,
    limits: { fileSize: MAX_IMG_FILE_SIZE }
});
const multerUploads = parser.array('image', MAX_IMGS_PER_UPLOAD);

const router = Router();

router.post(endpoints.post.CREATE_POST, authenticate, createPostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const content = req.body;
        const post = await createPost(content.id, req.userId, content.type, content.text);
        res.status(httpCodes.CREATED).send(post);
    }));


router.post('/imageposts', authenticate, multerUploads, createPostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const content = req.body;
        if (!req.files)
            throw new AppError(httpCodes.BAD_REQUEST, 'Image not provided error', 'Image was not successfully uploaded');
        const imageUrls = req.files.map(file => file.url);
        const post = await createPost(content.id, req.userId, content.type, content.text, imageUrls);
        res.status(httpCodes.CREATED).send(post);
    }));

/**
 * Get posts by section('top'|'latest') or by hashtag(#{SomeWord})
 */
router.get(endpoints.post.GET_POSTS, authenticate,
    handleErrorAsync(async (req, res) => {
        const posts = req.query.section ? await getPostsBySection(req.userId, req.query.section, req.query.offset, req.query.limit) : await getPostsByHashtag(req.userId, req.query.hashtag, req.query.offset, req.query.limit);
        res.status(httpCodes.OK).send(posts);
    }));

router.get('/posts/:postId', authenticate, getPostValidationRules, validate,
    handleErrorAsync(async (req, res) => {
        const post = await getPost(req.userId, req.params.postId);
        res.status(httpCodes.OK).send(post);
    }));

router.get('/photos/:photoId', authenticate, getPhotoValidationRules, validate,
    handleErrorAsync(async (req, res) => {
        const post = await getPostFromPhoto(req.userId, req.params.photoId);
        res.status(httpCodes.OK).send(post);
    }));

router.post(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const response = await likePost(req.userId, req.params.postId);
        res.status(httpCodes.OK).send(response);
    }));

router.delete(endpoints.post.LIKE_POST(':postId'), authenticate, likePostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const response = await removeLikeOrDislikeFromPost(req.userId, req.params.postId);
        res.status(httpCodes.OK).send(response);
    }));

router.post(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const response = await dislikePost(req.userId, req.params.postId);
        res.status(httpCodes.OK).send(response);
    }));

router.delete(endpoints.post.DISLIKE_POST(':postId'), authenticate, likePostValidationRules,
    validate, handleErrorAsync(async (req, res) => {
        const response = await removeLikeOrDislikeFromPost(req.userId, req.params.postId);
        res.status(httpCodes.OK).send(response);
    }));

// TODO need to validate hashtag
router.get(`/trending/`, authenticate,
    handleErrorAsync(async (req, res) => {
        const hashtags = await getTrendingHashtags()
        res.json(hashtags)
    }))

export default router;