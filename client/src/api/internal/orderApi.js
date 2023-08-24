import { api } from "./index";

export const saveOrder = async(data) => {
    let response;
    try {
        response = await api.post('/ordercreate',data)
    } catch (error) {
        return error
    }
    return response
}
export const getAllOrder = async(filter,page) => {
    let query = '/orders'
    if(page){
        query = query + `?_page=${page}&_limit=10&`
    }
    if(filter!== 'All'){
        query  = query + `status=${filter}`
    }
    let response;
    try {
        response = await api.get(query)
    } catch (error) {
        return error
    }
    return response
}
export const getUserOrder = async(id,filter) => {
    let query = `/order/user/${id}`
    if(filter !== 'All'){
        query = query + `?status=${filter}`
    }
    let response;
    try {
        response = await api.get(query)
    } catch (error) {
        return error
    }
    return response
}
export const getOrderDetail = async(data) => {
    let response;
    try {
        response = await api.get(`/order/${data}`)
    } catch (error) {
        return error
    }
    return response
}
