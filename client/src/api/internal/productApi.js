import {api} from './index'

export const getCategories = async() => {
    let response; 
    try {
        response  = await api.get('/categories')
    } catch (error) {
        console.log(error)
    }
    return response
} 
export const getBrands = async() => {
    let response; 
    try {
        response  = await api.get('/brands')
    } catch (error) {
        console.log(error)
    }
    return response
} 
export const getProducts = async(filters,sort,paginate) => {
    let response; 
    let query='/products?'
    for (let key in filters){
        // will un comment when live server here dont work
        // let value = filters[key].join(',')  
        let value = [...filters[key]]
        // let last = value[-1]
        query += `${key}=${value}&`
    }
    for (let key in sort){
        query+=`${key}=${sort[key]}&`
    }
    for (let key in paginate){
        query+=`${key}=${paginate[key]}&`
    }
    try {
        response  = await api.get(query)        
    } catch (error) {
        console.log(error)
    }
    return response
} 
export const getProductById = async(id) => {
    let response; 
    try {
        response  = await api.get('/products/'+id)
        console.log("🚀 ~ file: productApi.js:48 ~ getProductById ~ response:", response)
    } catch (error) {
        console.log(error)
    }
    return response
} 
