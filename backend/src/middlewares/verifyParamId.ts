import httpCodes from "../utils/constants/httpResponseCodes";

/**
 * Verify that the req.param[identifier] (aka the userId passed as a param)
 * matches req.userId (aka the userId of the authenticated user)
 * In case user ids don't match returns a FORBIDDEN request error
 * @param identifier
 */
export const verifyParamIdMatchesLoggedUser = (identifier: string) => (req, res, next) => {
    if (req.userId !== req.params[identifier]) {
        return res.status(httpCodes.FORBIDDEN).send({error: "userId does not correspond with the authentication"});
    }
    next()
}