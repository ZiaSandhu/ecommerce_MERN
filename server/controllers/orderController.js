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

const getOrderById = async(req,res,next) => {
    let orders;
    const result = idSchema(req.params.id)
    if(result === true){

        try {
            orders = await Order.find({})
        } catch (error) {
            return next(error)
        }

    }
    else{
        return next(result)
    }
    res.status(200).json({msg:"Get all Orders",orders})

}

const createOrder = async(req,res,next) => {
    const orderSchema = Joi.object({
        userId: Joi.string().regex(IdPattern).required(),
        products: Joi.array().items(
            Joi.object({
                productId: Joi.string().regex(IdPattern).required(),
                qty: Joi.number(),
                price: Joi.number(),
                subTotal: Joi.number(),
                variation: Joi.string()
            })
        ),
        status : Joi.string().required(),
        amount : Joi.number().required(),
        payment : Joi.string().required(),
        shipping : Joi.number().required(),
    })
    const {error} = orderSchema.validate(req.body)
    if(error){
        return next(error)
    }

    const {userId, products, status, amount, payment, shipping } = req.body

    let order;
    const newOrder = new Order({
        userId, products, status, amount, payment, shipping
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
    deleteOrder
}