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
        let value = filters[key].join(',')  
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
        return error
    }
    return response
} 
export const getProductById = async(id) => {
    let response; 
    try {
        response  = await api.get('/product/'+id)
    } catch (error) {
        return error
    }
    return response
} 
export const getAllProduct = async() => {
    let response; 
    try {
        response  = await api.get('/getProducts')
    } catch (error) {
        return error
    }
    return response
} 
