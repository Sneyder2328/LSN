"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("../constants/errors"));
const AppError_1 = require("./AppError");
const httpResponseCodes_1 = __importDefault(require("../constants/httpResponseCodes"));
class UserNotFoundError extends AppError_1.AppError {
    constructor(message = errors_1.default.USER_NOT_FOUND_ERROR) {
        super(httpResponseCodes_1.default.NOT_FOUND, errors_1.default.USER_NOT_FOUND_ERROR, message);
    }
}
exports.UserNotFoundError = UserNotFoundError;
