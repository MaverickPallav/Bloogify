const JWT = require('jsonwebtoken')

const secret = 'Maverick'

function createUserToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        fullName: user.fullName
    }

    const token = JWT.sign(payload, secret)

    return token
}

function validateUserToken(token) {
    const payload = JWT.verify(token, secret)

    return payload
}

module.exports = {
    createUserToken,
    validateUserToken
}