const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    name : {type:String, required: true},
    phone : {type:String, required: true},
    email : {type:String, required: true},
    country : {type:String, required: true},
    street : {type:String, required: true},
    city : {type:String, required: true},
    region : {type:String, required: true},
    postalcode : {type:String, required: true},
})
const userSchema = new mongoose.Schema({
    username : {type:String, required: true},
    email : {type:String, required: true},
    password : {type:String, required: true},
    role: {type: String, default: 'Customer'},
    favourites: {type: Array, default:[] },
    shippingAddresses: {type: [addressSchema], default:[] }
},{timestamps:true})

module.exports = mongoose.model('User', userSchema)