const {genUUID} = require('../src/utils/utils');

const users = [
    {
        id: genUUID(),
        username: 'usernametest',
        typeLogin: 'email',
        email: 'usertest@mail.com',
        password: 'somesecggjrettest'
    },
    {
        id: genUUID(),
        username: 'usernametest2',
        typeLogin: 'email',
        email: 'usertest2@hotmail.com',
        password: 'somesecretjgjgtest2'
    },
    {
        id: genUUID(),
        username: 'iamtheking007',
        typeLogin: 'email',
        email: 'thekingforever007@gmail.com',
        password: 'somesecretjgjgtest54gjhjhj'
    }
];

const profiles = [
    {
        userId: users[0].id,
        username: users[0].username,
        fullname: 'User Test',
        description: 'Some nice description',
        coverPhotoUrl: 'coverPhoto.jpg',
        profilePhotoUrl: 'profilePhoto.png'
    },
    {
        userId: users[1].id,
        username: users[1].username,
        fullname: 'User Test 2',
        description: 'o inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur au',
        coverPhotoUrl: 'consequatur.jpg',
        profilePhotoUrl: 'inventore.png'
    },
    {
        userId: users[2].id,
        username: users[2].username,
        fullname: 'King Zero07',
        description: 'o inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam vptas sit aspernatur au',
        coverPhotoUrl: 'consequatur007.jpg',
        profilePhotoUrl: 'inventore007.png'
    }
];

const posts = [
    {
        id: genUUID(),
        userId: users[0].id,
        text: "Hello world and welcome to La Social Network",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0
    },
    {
        id: genUUID(),
        userId: users[1].id,
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0
    },
    {
        id: genUUID(),
        userId: users[0].id,
        text: "m ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0
    }
];

const comments = [
    {
        id: genUUID(),
        userId: posts[0].userId,
        postId: posts[0].id,
        text: "Hello world and welcome to La Social Network",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[0].userId,
        postId: posts[0].id,
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[1].userId,
        postId: posts[1].id,
        text: "m ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "m ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "I",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "II",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "III",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "IV",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "V",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "VI",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "VII",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "VIII",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "VIII",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "IX",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "X",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XI",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XII",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XIII",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XIV",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XV",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    },
    {
        id: genUUID(),
        userId: posts[2].userId,
        postId: posts[2].id,
        text: "XVI",
        type: "text",
        img: "",
        likesCount: 0,
        dislikesCount: 0,
    }
];

const tokens = [
    {
        token: genUUID(),
        userId: users[0].id
    }
];

module.exports = {users, profiles, posts, comments, tokens};