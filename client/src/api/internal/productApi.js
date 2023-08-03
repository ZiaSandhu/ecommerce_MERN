import {api} from './index'

export const getAllProducts = async() => {
    let response; 
    try {
        response  = await api.get('/products')
    } catch (error) {
        console.log(error)
    }
    return response
} 
export const getFilterProducts = async(filters,sort) => {
    let response; 
    let query=''
    for (let key in filters){
        let value = filters[key].join(',')
        query += `${key}=${value}&`
    }
    if(sort!=={}){
        query+=`_sort=${sort._sort}&order=${sort.order}`
    }
        console.log("🚀 ~ file: productApi.js:19 ~ getFilterProducts ~ query:", query)
    
    try {
        response  = await api.get('/products?'+query)
    } catch (error) {
        console.log(error)
    }
    return response
} 