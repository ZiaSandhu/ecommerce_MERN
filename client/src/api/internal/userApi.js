import { api } from './index'

export const registerUser = async (data) => {

    let response;
    try {
        response = await api.post(
            '/register',
            data
        )
    } catch (error) {
        // console.log(error)
        return error
    }
    return response
}
export const loginUserApi = async (data) => {

    let response;
    try {
        response = await api.post(
            '/login', data
        )
    } catch (error) {
        return error
    }
    return response
}
export const updateUser = async (data) => {
    let response;
    try {
        response = await api.patch(
            '/updateuser',
            data
        )
    } catch (error) {
        console.log("🚀 ~ file: userApi.js:37 ~ updateUser ~ error:", error)
        return error
    }
    return response
}
export const logoutUserApi = async () => {

    let response;
    try {
        response = await api.get('/logout')
    } catch (error) {
        console.log(error)
    }
    return response
}
