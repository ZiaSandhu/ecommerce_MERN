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
export const getAllOrder = async() => {
    let response;
    try {
        response = await api.get('/orders')
    } catch (error) {
        return error
    }
    return response
}
export const getUserOrder = async(data) => {
    let response;
    try {
        response = await api.get(`/order/user/${data}`)
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
