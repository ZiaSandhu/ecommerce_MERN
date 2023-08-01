require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const BASE_URL = process.env.BASE_URL
module.exports = {
    PORT, URI, REFRESH_TOKEN, ACCESS_TOKEN, BASE_URL
}