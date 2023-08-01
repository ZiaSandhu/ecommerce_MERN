const mongoose = require('mongoose')

const cartProductSchema = new mongoose.Schema({
    productId: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    variation: {type: String, required:true}
  });

module.exports = {cartProductSchema}