import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://cdn-pridestore.vercel.app/api',
    withCredentials: true,
    headers:{
        'Content-Type': 'application/json'
    }
})