const mongoose = require('mongoose')

async function dbConnect(uri) {
    try {
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.info(`Database Connect to host: ${conn.connection.host}`)

    } catch (error) {
        console.error(error)
    }
    
}

module.exports = dbConnect