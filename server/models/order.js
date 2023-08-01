const mongoose = require('mongoose')

const {cartProductSchema} = require('./cartProducts')

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, ref:'User'},
    products:[cartProductSchema],
    status:{type:String,default:'draft'},
    amount:{type:Number,default:0},
    payment:{type:String,default:'Via Card'},
    shipping:{type:Number,default:0},
},{timestamps:true})

module.exports = mongoose.model('Order',orderSchema)