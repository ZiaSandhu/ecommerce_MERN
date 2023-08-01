const {ValidationError} = require('joi')
const errorHandle = (error,req,res,next) => {

    let status = 500
    let data = {
        message: 'Internal Server Error'
    }

    if (error instanceof ValidationError){
        status = 401
        data.message = error.message

        // return res.status(status).json(data)
    }
    else{
        if(error.status){
            status = error.status
        }
        if(error.message){
            data.message = error.message
        }
    }

    return res.status(status).json(data)

}

module.exports = errorHandle