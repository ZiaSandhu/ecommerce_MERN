const Joi = require('joi')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const JwtService = require('../services/jwtServices')
const Token = require('../models/token')
const UserDto = require('../dto/userDto')
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:'\",.<>?/]).{8,32}$/

const errorGlobal = {
    status: 500,
    message: ''
}

const asignTokens = (id, res) => {
    let accessToken = JwtService.signAccessToken({ _id: id }, '30m')
    let refreshToken = JwtService.signRefreshToken({ _id: id }, '60m')

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    })
}
const register = async (req, res, next) => {
    const registerSchema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordPattern).required(),
        role: Joi.string()
    })
    const { error } = registerSchema.validate(req.body)

    if (error) {
        return next(error)
    }
    const { username, email, password, role } = req.body

    // checking if mail and username exists or not
    let user
    let userExist = await User.exists({ username })
    if (userExist) {
        errorGlobal.status = 409
        errorGlobal.message = "UserName already exists! Try different."
        return next(errorGlobal)
    }
    let emailExist = await User.exists({ email })
    if (emailExist) {
        errorGlobal.status = 409
        errorGlobal.message = "Email already exists! Try different."
        return next(errorGlobal)
    }
    let hashedPassword = await bcrypt.hash(password, 10)
    let newUser = new User({
        username, email, password: hashedPassword, role
    })
    try {
        user = await newUser.save()
    } catch (error) {
        return next(error)
    }
    asignTokens(user._id, res)
    return res.status(201).json({ msg: 'User Created', user: new UserDto(user), auth: true })
}
const login = async (req, res, next) => {
    const registerSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(passwordPattern).required(),
    })
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return next(error)
    }
    const { email, password, } = req.body
    let user;
    try {
        user = await User.findOne({ 'email': email })
        if (!user) {
            errorGlobal.status = 401
            errorGlobal.message = "Invalid Credentials"

            return next(errorGlobal)
        }
    } catch (error) {
        return next(error)
    }
    const match = await bcrypt.compare(password, user.password)
    if (match) {
        asignTokens(user._id, res)
        return res.status(200).json({ msg: 'User login Successfuly', user: new UserDto(user), auth: true })
    }
    else {
        errorGlobal.status = 401
        errorGlobal.message = "Invalid Credentials"
        return next(errorGlobal)
    }


}
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies
        await Token.deleteOne({ token: refreshToken })
    } catch (error) {
        return next(error)
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({ msg: 'User logout successfuly', user: null, auth: false })
}
const changePassword = async (req, res, next) => {
    const changePasswordSchema = Joi.object({
        _id: Joi.string().required(),
        oldPassword: Joi.string().pattern(passwordPattern).required(),
        newPassword: Joi.string().pattern(passwordPattern).required(),
        confirmPassword: Joi.ref('newPassword'),
    })
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        return next(error)
    }
    const { _id, oldPassword, newPassword } = req.body;

    let user;
    try {
        user = await User.findById({ _id })
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            errorGlobal.status = 409
            errorGlobal.message = 'Enter correct Password'
        }
        let hashedPassword = await bcrypt.hash(newPassword, 10)
        user = await User.updateOne({ _id }, { password: hashedPassword })
    } catch (error) {
        return next(error)
    }
    res.status(200).json({ msg: 'Password Changes Successfully', user, auth: false })
}
const refresh = async (req, res, next) => {
    // to be completed
}

module.exports = { register, login, logout, refresh, changePassword }