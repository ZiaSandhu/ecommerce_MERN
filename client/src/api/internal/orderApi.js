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