"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const app_1 = __importDefault(require("./modules/app"));
const cors_2 = require("./middlewares/cors");
const utils_1 = require("./utils/utils");
exports.app = express_1.default();
const port = process.env.PORT || 3030;
exports.app.use(compression_1.default()); // compress all responses
exports.app.use(cors_1.default(cors_2.corsOptions));
exports.app.use(body_parser_1.default.json());
exports.app.use('/', app_1.default);
exports.server = exports.app.listen(port, () => {
    console.log(`Server started on port ${port}`, utils_1.genUUID());
});
