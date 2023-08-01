const mongoose = require('mongoose')

const variationSchema = new mongoose.Schema({
    colors: {type:String, required:true},
    stock: {type: Number, required: true}
})


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    company: {type: String, required: true},
    category: {type: String, required: true},
    variations:[variationSchema],
    images: {type: Array},
    isFeatured: {type: Boolean, default: false},
    rating: {type:Number,default:0},
    reviews: {type:Number,default:0},
    discount: {type:Number,default:0},
    price: {type:Number,default:0},
},{timestamps:true})

module.exports = mongoose.model('Product', productSchema)