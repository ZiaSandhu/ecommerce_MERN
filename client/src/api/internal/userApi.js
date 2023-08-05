import {api} from './index'

export const registerUser = async(data) => {
    
    let response;
    try {
        response = await api.post(
            '/users',
            data
        )
    } catch (error) {
        console.log(error)
    }
    return response
}
export const loginUserApi = async(data) => {
    
    let response;
    try {
        response = await api.get(
            `/users?email${data.email}&password=${data.password}`,
        )
        if(!response.data.length){
            return response.status = 401
        }
    } catch (error) {
        console.log(error)
    }
    return response
}