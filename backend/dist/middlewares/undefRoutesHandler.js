"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../utils/errors/AppError");
const errors_1 = __importDefault(require("../utils/constants/errors"));
const httpResponseCodes_1 = __importDefault(require("../utils/constants/httpResponseCodes"));
/**
 * Handle undefined routes
 * @param req
 * @param res
 * @param next
 */
exports.default = (req, res, next) => {
    const err = new AppError_1.AppError(httpResponseCodes_1.default.NOT_FOUND, errors_1.default.NOT_FOUND, errors_1.default.message.UNDEFINED_ROUTE);
    next(err, req, res, next);
};
