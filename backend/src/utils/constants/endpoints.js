module.exports = {
    auth: {
        LOG_IN: '/logIn',
        SIGN_UP: '/signUp',
        LOG_OUT: '/logOut',
        REFRESH_TOKEN: '/refreshToken'
    },
    user: {
        GET_PROFILE: (username) => `/profile/${username}`,
        SEND_FRIEND_REQUEST: '/sendFriendRequest',
        GET_FRIEND_REQUESTS: '/friendRequests',
        ACCEPT_FRIEND_REQUEST: '/acceptFriendRequest'
    },
    post: {
        CREATE_POST: '/createPost',
        GET_POSTS: '/getPosts'
    }
};