const mongoose = require('mongoose')

const {cartProductSchema} = require('./cartProducts')

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, ref:'User'},
    products:[cartProductSchema],
},{timestamps:true})

module.exports = mongoose.model('Cart',orderSchema)