"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("./AppError");
const httpResponseCodes_1 = __importDefault(require("../constants/httpResponseCodes"));
class AuthError extends AppError_1.AppError {
    constructor(error, message = '') {
        super(httpResponseCodes_1.default.UNAUTHORIZED, error, message);
    }
}
exports.AuthError = AuthError;
