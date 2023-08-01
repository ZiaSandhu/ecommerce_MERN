
const jwt = require('jsonwebtoken')
const Token = require('../models/token')
const {ACCESS_TOKEN} = require('../config/index')
const {REFRESH_TOKEN} = require('../config/index')
class JwtService{
    static signAccessToken(payload, expiresIn, secret = ACCESS_TOKEN){
        return jwt.sign(payload, secret, {expiresIn})
    }
    static signRefreshToken(payload, expiresIn, secret=REFRESH_TOKEN){
        return jwt.sign(payload, secret, {expiresIn})
    }
    // verify access Token
    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN)
    }

    // verify access Token
    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN)
    }
    // store refresh token 
    static async storeRefreshToken(token, userId){
        try {
            const newToken = new Token({
                token,
                userId
            })
            await newToken.save()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = JwtService