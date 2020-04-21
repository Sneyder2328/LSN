"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [/mystifying-liskov-d8ef00.netlify.com/, /localhost/]
        : [/localhost/],
    credentials: true,
    allowedHeaders: 'Content-Type, authorization, authorization-refresh-token, X-Requested-With, Accept',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    exposedHeaders: 'authorization, authorization-refresh-token'
};
