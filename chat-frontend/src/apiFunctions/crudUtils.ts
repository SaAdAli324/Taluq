import api from "../api";

export const deleteResource=async(endpoint:string)=>{
    try {
        const response = await api.delete(`${endpoint}`)
        return response.data
    } catch (error) {
        console.log(`error in deleting resource ${endpoint} :`,error);
        throw error
    }
}

export const patchResource=async(endpoint:string)=>{
    try {
        const response = await api.patch(`${endpoint}`)
        return response.data.message
    } catch (error) {
        console.log(`error in patching resource ${endpoint} :`,error);
        throw error
    }
}

export const updateResource=async(endpoint:string,payload:any)=>{
    try {
        const response = await api.put(`${endpoint}`,payload)
        return response.data
    } catch (error) {
        console.log(`error in updating resource ${endpoint} :`,error);
        throw error
    }
}

export const getResource=async(endpoint:string)=>{
    try {
        const response = await api.get(`${endpoint}`)
        return response.data
    } catch (error) {
        console.log(`error in getting resource ${endpoint} :`,error);
        throw error
    }
}

export const postResource=async(endpoint:string,payload:any)=>{
    try {
        const response = await api.post(`${endpoint}`,payload)
        return response.data
    } catch (error) {
        console.log(`error in posting resource ${endpoint} :`,error);
        throw error
    }
}