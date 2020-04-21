"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("../constants/errors"));
const httpResponseCodes_1 = __importDefault(require("../constants/httpResponseCodes"));
class AppError extends Error {
    constructor(statusCode = httpResponseCodes_1.default.INTERNAL_SERVER_ERROR, name = errors_1.default.DEFAULT_ERROR, message = errors_1.default.message.DEFAULT_ERROR) {
        super();
        this.statusCode = statusCode;
        this.name = name;
        this.message = message;
        Error.captureStackTrace(this, AppError);
    }
}
exports.AppError = AppError;
