const Joi = require('joi')
const Order = require('../models/order')
const IdPattern = /^[a-fA-F0-9]{24}$/


const idSchema = (id) => {
    const schema = Joi.object({
        id: Joi.string().regex(IdPattern).required()
    })
    const {error} = schema.validate(id)
    if(error){
        return error
    }
    return true
}
const getOrder = async(req,res,next) => {
    let orders;
    try {
        orders = await Order.find({})
    } catch (error) {
        return next(error)
    }
    
    res.status(200).json({msg:"Get all Orders",orders})

}
const getUserOrder = async(req,res,next) => {
    let orders;
    const result = idSchema(req.params)
    const {id} = req.params
    if(result === true){
        try {
            orders = await Order.find({userId:id})
        } catch (error) {
            return next(error)
        }
        res.status(200).json({msg:"Get my Orders",orders})
    }
    else{
        return next(result)
    }
}

const getOrderById = async(req,res,next) => {
    let order;
    const result = idSchema(req.params.id)
    if(result === true){

        try {
            order = await Order.find({_id:req.params.id})
        } catch (error) {
            return next(error)
        }

        res.status(200).json({msg:"Get Order Summary",order})
    }
    else{
        return next(result)
    }

}

const createOrder = async(req,res,next) => {
    const addressSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        country: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        region: Joi.string().required(),
        postalcode: Joi.string().required(),
        _id: Joi.string().regex(IdPattern).required(),
    })
    const orderSchema = Joi.object({
        userId: Joi.string().regex(IdPattern).required(),
        products: Joi.array().items(
            Joi.object({
                productId: Joi.string().regex(IdPattern).required(),
                qty: Joi.number(),
                price: Joi.number().required(),
                subTotal: Joi.number().required(),
                title: Joi.string().required(),
                color: Joi.string().required(),
                size: Joi.string().required(),
                thumbnail: Joi.string().required(),
                itemId: Joi.string()
            })
        ),
        status : Joi.string().required(),
        subTotal : Joi.number().required(),
        totalAmount : Joi.number().required(),
        shippingFee : Joi.number().required(),
        payment : Joi.string().required(),
        shippingAddress : addressSchema.required(),
    })
    const {error} = orderSchema.validate(req.body)
    if(error){
        return next(error)
    }

    const {userId, products, status, totalAmount, payment, shippingFee, subTotal, shippingAddress } = req.body

    let order;
    const newOrder = new Order({
        userId, products, status, totalAmount, payment, shippingFee, subTotal, shippingAddress 
    })
    try {
        order = await newOrder.save();
    } catch (error) {
        return next(error)
    }

    res.status(201).json({msg:"order created",order})
}
    

const deleteOrder = async(req,res,next) => {
    
}

module.exports = {
    getOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    getUserOrder
}