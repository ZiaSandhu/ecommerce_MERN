const Joi = require('joi')
const User = require('../models/User')
// const IdPattern = /^[a-fA-F0-9]{24}$/


const idSchema = (id) => {
    const schema = Joi.object({
        id: Joi.string().regex(IdPattern).required()
    })
    const {error} = idSchema.validate(id)
    if(error){
        return error
    }
    return true
}
const getAllUsers = async(req,res,next) => {
    let Users;
    try {
        Users = await User.find({})
    } catch (error) {
        return next(error)
    }
    
    res.status(200).json({msg:"Get all Users",Users})

}
const getUserById = async(req,res,next) => {
    let user;
    const id = req.params.id
    const result = idSchema(id)
    if(result === true){

        try {
            user = await User.findOne({_id:id})
        } catch (error) {
            return next(error)
        }

    }
    else{
        return next(result)
    }
    res.status(200).json({msg:"Get user",user})

}

module.exports = {getAllUsers, getUserById}