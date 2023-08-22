const mongoose = require('mongoose')
const Product = require('./models/Product')
const {URI}  = require('./config/index')
const products = require('./data.json')
async function dbConnect(uri) {
    let conn
    try {
        conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.info(`Database Connect to host: ${conn.connection.host}`)

    } catch (error) {
        console.error(error)
    }
    await Product.deleteMany({})
    let res = await Product.insertMany(products)
    console.log("🚀 ~ file: databaseTest.js:19 ~ dbConnect ~ res:", res)
    
}

dbConnect(URI);