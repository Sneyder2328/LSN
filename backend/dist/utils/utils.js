"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * gen hex(uuid) for user,post,comment,etc
 */
exports.genUUID = () => uuid_1.v4();
exports.hashPassword = (saltRounds = 10, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        bcryptjs_1.default.hash(password, saltRounds, (err, hash) => {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
});
exports.verifyPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise(((resolve) => {
        bcryptjs_1.default.compare(password, hashedPassword, (err, success) => {
            if (err || !success)
                resolve(false);
            resolve(true);
        });
    }));
});
exports.compareByDateDesc = (one, two) => new Date(one.createdAt).getTime() - new Date(two.createdAt).getTime();
exports.compareByDateAsc = (one, two) => new Date(two.createdAt).getTime() - new Date(one.createdAt).getTime();
