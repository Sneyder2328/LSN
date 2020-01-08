"use strict";
module.exports = {
    auth: {
        LOG_IN: '/sessions',
        SIGN_UP: '/users',
        LOG_OUT: '/sessions',
        REFRESH_TOKEN: '/tokens'
    },
    user: {
        GET_PROFILE: (username) => `/users/${username}`,
        SEND_FRIEND_REQUEST: (receiverUserId) => `/users/${receiverUserId}/friends`,
        GET_FRIEND_REQUESTS: '/me/friends/incoming',
        RESPOND_TO_FRIEND_REQUEST: (senderUserId) => `/users/${senderUserId}/friends`
    },
    post: {
        CREATE_POST: '/posts',
        GET_POSTS: '/posts',
        LIKE_POST: (postId) => `/posts/${postId}/likes`,
        DISLIKE_POST: (postId) => `/posts/${postId}/dislikes`
    },
    comment: {
        CREATE_COMMENT: (postId) => `/posts/${postId}/comments`,
        LIKE_COMMENT: (commentId) => `/comments/${commentId}/likes`,
        DISLIKE_COMMENT: (commentId) => `/comments/${commentId}/dislikes`,
        GET_COMMENTS: (postId) => `/posts/${postId}/comments`
    }
};
