"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.cloudinary = cloudinary_1.default;
const { v2 } = cloudinary_1.default;
const { config, uploader } = v2;
exports.uploader = uploader;
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
exports.cloudinaryConfig = cloudinaryConfig;
config(cloudinaryConfig);
