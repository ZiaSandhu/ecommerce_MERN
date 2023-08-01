const User = require('../models/User')
const JWTService = require('../services/jwtServices')
const auth = async(req,res,next) => {
    try {
        const {refreshToken, accessToken} = req.cookies
        
        if(!refreshToken || !accessToken){
            const error = {
                status: 401,
                message: 'Unauthorized'
            }
            return next(error);
        }

        let _id;

    try{
        _id = JWTService.verifyAccessToken(accessToken)._id;
    }
    catch(error){
        return next(error);
    }

    let user;

    try{
        user = await User.findOne({_id: _id});
    }
    catch(error){
        return next(error);
    }
    next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {auth}