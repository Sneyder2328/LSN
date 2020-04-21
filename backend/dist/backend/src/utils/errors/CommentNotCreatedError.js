"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("./AppError");
const httpResponseCodes_1 = __importDefault(require("../constants/httpResponseCodes"));
const errors_1 = __importDefault(require("../constants/errors"));
class CommentNotCreatedError extends AppError_1.AppError {
    constructor(message = errors_1.default.POST_NOT_CREATED) {
        super(httpResponseCodes_1.default.BAD_REQUEST, errors_1.default.POST_NOT_CREATED, message);
    }
}
exports.CommentNotCreatedError = CommentNotCreatedError;
