const { validateUserToken } = require("../services/authentication");

function checkForAuthenticationCookie (cookieName) {
    return (req, res, next) => {
        const cookieValue = req.cookies[cookieName]

        if (!cookieValue) {
            return next();
        }

        try {
            const userPayload = validateUserToken(cookieValue)
            req.user = userPayload
        } catch(error) {}
        
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
}