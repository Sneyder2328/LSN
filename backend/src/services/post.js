const {Post, Profile} = require('../database/database');
const {genUUID} = require('../utils/utils');
const PostNotCreatedError = require('../utils/errors/PostNotCreatedError');

async function createPost(userId, type, text, img) {
    const post = await Post.create({id: genUUID(), userId, type, text, img});
    if (!post) throw new PostNotCreatedError();
    return post.dataValues;
}

async function getPosts() {
    const posts = await Post.findAll({include: [Profile]});
    if (!posts) return [];
    return posts.map(post => post.dataValues);
}

module.exports = {createPost, getPosts};