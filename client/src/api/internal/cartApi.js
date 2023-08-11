import {api} from './index'

export const addCart = async(data) => {
    let response;
    try {
        response = await api.post('/carts',data)
    } catch (error) {
        console.log(error);
    }
    return response
}