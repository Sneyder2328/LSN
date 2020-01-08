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
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
/**
 * gen hex(uuid) for user,post,comment,etc
 */
function genUUID() {
    return uuid.v4();
}
function hashPassword(saltRounds = 10, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err)
                    reject(err);
                resolve(hash);
            });
        });
    });
}
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise(((resolve, reject) => {
            bcrypt.compare(password, hashedPassword, (err, success) => {
                if (err || !success)
                    resolve(false);
                resolve(true);
            });
        }));
    });
}
module.exports = { genUUID, hashPassword, verifyPassword };
