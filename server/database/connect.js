const mongoose = require('mongoose')

async function dbConnect(uri) {
    try {
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch (error) {
    }
    
}

module.exports = dbConnect