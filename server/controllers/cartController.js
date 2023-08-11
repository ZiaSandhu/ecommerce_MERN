const Joi = require('joi')
const Cart = require('../models/cart')
const IdPattern = /^[a-fA-F0-9]{24}$/

const udpateCart = async(req,res,next) => {
    const cartSchema = Joi.object({
        userId: Joi.string().regex(IdPattern).required(),
        products: Joi.array().items(
            Joi.object({
                productId: Joi.string().regex(IdPattern).required(),
                qty: Joi.number(),
                price: Joi.number(),
                variation: Joi.string()
            })
        )
    })
    const {error} = cartSchema.validate(req.body)
    if(error){
        return next(error)
    }
    const {userId, products} = req.body
    let cart,status;
    try {
        cart = await Cart.findOne({userId})
        let newCart;
        if(!cart){
            newCart = new Cart({
                userId,
                products
            })
            cart = await newCart.save();
            
            status = 201
        }
        else{
            cart.products = products
            console.log("🚀 ~ file: cartController.js:39 ~ udpateCart ~ cart:", cart)
            cart.save()
            status = 200
        }
    } catch (error) {
        return next(error)
    }
    res.status(status).json({msg:'Cart updated', cart})
}
const getCarts = async(req,res,next) => {
    let cart;
    try {
        cart = await Cart.find({})
    } catch (error) {
        return next(error)
    }
    
    res.status(200).json({msg:"Get all cart",cart})

}
const getUserCart = async(req,res,next) => {
    const cartSchema = Joi.object({
        userId: Joi.string().regex(IdPattern).required(),
    })
    const {error} = cartSchema.validate(req.params)
    if(error){
        return next(error)
    }
    const {userId} = req.params
    let cart;
    try {
        cart = await Cart.findOne({userId})
    } catch (error) {
        return next(error)
    }
    
    res.status(200).json({msg:"Get user cart",cart})

}



module.exports = {udpateCart, getCarts, getUserCart}