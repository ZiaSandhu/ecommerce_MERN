const mongoose = require('mongoose')
const { cartProductSchema } = require('./cartProducts')
const addressSchema = new mongoose.Schema({
    _id: {type: String},
    name : {type:String, required: true},
    phone : {type:String, required: true},
    email : {type:String, required: true},
    country : {type:String, required: true},
    street : {type:String, required: true},
    city : {type:String, required: true},
    region : {type:String, required: true},
    postalcode : {type:String, required: true},
})
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    products: {type: [cartProductSchema], required:true},
    status: { type: String, default: 'placed' },
    shippingFee: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    payment: { type: String, default: 'Card' },
    shippingAddress: addressSchema,

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)