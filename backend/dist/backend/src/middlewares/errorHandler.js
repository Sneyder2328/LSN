"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpResponseCodes_1 = __importDefault(require("../utils/constants/httpResponseCodes"));
exports.default = (err, req, res, _) => {
    err.statusCode = err.statusCode || httpResponseCodes_1.default.INTERNAL_SERVER_ERROR;
    res.status(err.statusCode).json({
        error: err.name,
        message: err.message
    });
};
