const {LIMIT_COMMENTS_PER_POST} = require("../utils/constants");

const {Post, Profile, PostLike, Comment} = require('../database/database');
const {genUUID} = require('../utils/utils');
const PostNotCreatedError = require('../utils/errors/PostNotCreatedError');

async function createPost(userId, type, text, img) {
    const post = await Post.create({id: genUUID(), userId, type, text, img});
    if (!post) throw new PostNotCreatedError();
    const response = post.toJSON();
    response.authorProfile = (await Profile.findByPk(userId)).toJSON();
    response.comments = [];
    return response;
}

async function getPosts() {
    let posts = await Post.findAll({
        include: [
            {model: Profile, as: 'authorProfile'},
            {model: Comment, as: 'comments', limit: LIMIT_COMMENTS_PER_POST, order: [['createdAt', 'DESC']]}
        ]
    });
    posts = posts.map(post => post.toJSON());


    const profilesToFetch = new Set();
    posts.forEach(post => {
        post.comments.forEach(comment => {
            profilesToFetch.add(comment.userId)
        });
    });
    const uniqueUserIdsToFetch = Array.from(profilesToFetch);
    let profiles = await Promise.all(uniqueUserIdsToFetch.map(userId => Profile.findByPk(userId)));
    profiles = profiles.map(profile => profile.toJSON());

    posts.forEach(post => {
        post.comments = post.comments.map(comment => {
            return {
                ...comment,
                authorProfile: profiles.find(profile => profile.userId === comment.userId)
            };
        });
    });

    if (!posts) return [];
    //console.log('getposts', posts);
    return posts;
}

async function likePost(userId, postId) {
    return PostLike.upsert({userId, postId, isLike: true});
}

async function removeLikeOrDislikePost(userId, postId) {
    const postLike = await PostLike.findOne({where: {userId, postId}});
    return await postLike.destroy() != null;
}

async function dislikePost(userId, postId) {
    const postLike = await PostLike.upsert({userId, postId, isLike: false});
    return postLike !== null;
}

module.exports = {createPost, getPosts, likePost, dislikePost, removeLikeOrDislikePost};