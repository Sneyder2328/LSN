"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpResponseCodes_1 = __importDefault(require("../utils/constants/httpResponseCodes"));
/**
 * Verify that the req.param[identifier] (aka the userId passed as a param)
 * matches req.userId (aka the userId of the authenticated user)
 * In case user ids don't match returns a FORBIDDEN request error
 * @param identifier
 */
exports.verifyParamIdMatchesLoggedUser = (identifier) => (req, res, next) => {
    if (req.userId !== req.params[identifier]) {
        return res.status(httpResponseCodes_1.default.FORBIDDEN).send({ error: "userId does not correspond with the authentication" });
    }
    next();
};
