const mongoose = require('mongoose')

const cartProductSchema = new mongoose.Schema({
  productId: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
  title: { type: String,required:true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String,required:true },
  color: { type: String,required:true },
  subTotal: { type: String,required:true },
  thumbnail: { type: String,required:true },
  itemId: { type: String,required:true },

});

module.exports = { cartProductSchema }