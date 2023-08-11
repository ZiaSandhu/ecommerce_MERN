const Joi = require('joi')
const User = require('../models/User')
// const IdPattern = /^[a-fA-F0-9]{24}$/


const getAllUsers = async (req, res, next) => {
    let Users;
    try {
        Users = await User.find({})
    } catch (error) {
        return next(error)
    }

    res.status(200).json({ msg: "Get all Users", Users })

}
const getUserById = async (req, res, next) => {
    let user;
    const id = req.params.id
    const schema = Joi.object({
        id: Joi.string().regex(IdPattern).required()
    })
    const { error } = schema.validate(id)
    if (error) {
        return next(error)
    }
    try {
        user = await User.findOne({ _id: id })
    } catch (error) {
        return next(error)
    }
    res.status(200).json({ msg: "Get user", user })

}
const updateUser = async (req, res, next) => {
    let user;
    const {id,resource} = req.body
    if(resource.shippingAddress){
        const addressSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            country: Joi.string().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            region: Joi.string().required(),
            postalcode: Joi.string().required(),
        })
        const {error} = addressSchema.validate(resource.shippingAddress)
        if(error){
            return next(error)
        }
    }
    try {
        user = await User.findOne({ _id: id });

        if (!user) {
            let error = {
                status:404,
                message: "User not found"
            }
            return next()
        }
        if(resource.shippingAddress){
            user.shippingAddresses.push(resource.shippingAddress);

            await user.save()
        }
        res.status(200).json({ msg: 'User updated Successfully' });
    } catch (error) {
        return next(error);
    }

}

module.exports = { getAllUsers, getUserById, updateUser }