const Joi = require('joi')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const JwtService = require('../services/jwtServices')
const Token = require('../models/token')

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:'\",.<>?/]).{8,32}$/

const errorGlobal = {
    status:500,
    message:''
}
const checkExist = async(name,value,next) => {
    let exist
    try {    
        exist = await User.exists({[name]:value})
        if(exist){
            errorGlobal.status = 409
            errorGlobal.message = `${name} already exists! try different`
            next(errorGlobal)
            return false
        }
    } catch(error){
            next(error)
            return false;  
    }
    return true
}
const asignTokens = (id,res) => {
        let accessToken = JwtService.signAccessToken({_id: id},'30m')
        let refreshToken = JwtService.signRefreshToken({_id: id},'60m')

        res.cookie('accessToken',accessToken,{
            httpOnly: true,
            maxAge: 1000*60*60*24
        })
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            maxAge: 1000*60*60*24
        })
}
const register = async(req,res,next) => {
    const registerSchema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        name: Joi.string().max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordPattern).required(),
        confirmPassword: Joi.ref('password'),
        cart: Joi.array().items(Joi.object()),
        role: Joi.string()
    })
    const {error} = registerSchema.validate(req.body)
    
    if(error){
        return next(error)
    }
    const {username, name, email, password, cart, role} = req.body

    // checking if mail and username exists or not
    let user
    if (await checkExist('username',username,next) && await checkExist('email',email,next)){
        let hashedPassword = await bcrypt.hash(password,10)
        let newUser = new User({
            name, username, email, password: hashedPassword, role
        })
        try {
            user = await newUser.save()
        } catch (error) {
            return next(error)
        }
        asignTokens(user._id,res)
        console.log("if")
        res.status(201).json({msg: 'User Created',user,auth:true})
    }

    res.status(201).json({msg: 'User Created',user,auth:false})
    

}
const login = async(req,res,next) => {
    const registerSchema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().pattern(passwordPattern).required(),
    })
    const {error} = registerSchema.validate(req.body)
    if(error){
        return next(error)
    }
    const {username,  password, } = req.body
    let user;
    try {
        user = await User.findOne({'username':username})
        // console.log("🚀 ~ file: authController.js:91 ~ login ~ user:", user)
        if(!user){
            errorGlobal.status = 401
            errorGlobal.message = "Username not found"

            return next(errorGlobal)
        }
    } catch (error) {
        console.log("🚀 ~ file: authController.js:98 ~ login ~ error:", error)
        
        return next(error)
    }
    const match = await bcrypt.compare(password,user.password)
    if(match){
        asignTokens(user._id,res)
        res.status(200).json({msg:'User login Successfuly',user,auth: true})
    }
    else{
        errorGlobal.status = 401
        errorGlobal.message = "Password not matched"
        return next(errorGlobal)
    }


}
const logout = async(req,res,next) => {
    try {
        const { refreshToken } = req.cookies
        await Token.deleteOne({token: refreshToken})
    } catch (error) {
        return next(error)    
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({msg:'User logout successfuly',user:null, auth: false})
}
const changePassword = async(req,res,next) => {
    const changePasswordSchema = Joi.object({
        _id: Joi.string().required(),
        oldPassword: Joi.string().pattern(passwordPattern).required(),
        newPassword: Joi.string().pattern(passwordPattern).required(),
        confirmPassword: Joi.ref('newPassword'),
    })
    const {error} = changePasswordSchema.validate(req.body);
    if(error){
        return next(error)
    }
    const {_id, oldPassword, newPassword } = req.body;

    let user;
    try {
        user = await User.findById({_id})
        const match = await bcrypt.compare(oldPassword, user.password)
        if(!match){
            errorGlobal.status = 409
            errorGlobal.message = 'Enter correct Password'
        }
        let hashedPassword = await bcrypt.hash(newPassword,10)
        user = await User.updateOne({_id},{password:hashedPassword})
    } catch (error) {
        return next(error)
    }
    res.status(200).json({msg:'Password Changes Successfully',user, auth: false})
}
const refresh = async(req,res,next) => {
// to be completed
}

module.exports = {register, login, logout, refresh, changePassword}