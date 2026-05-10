import axiosClient from "../axiosClient"


export const GetCategories = ()=>{
    return axiosClient.get('/categories');
}

export const CreateCategory = (data: FormData) => {
    return axiosClient.post('/categories', data);
}

export const UpdateCategory = (id: number, data: FormData) => {
    return axiosClient.put(`/categories/${id}`, data);
}

export const DeleteCategory = (id: number) => {
    return axiosClient.delete(`/categories/${id}`);
}

export const UploadCategoryImage = (id: number, data: FormData) => {
    return axiosClient.post(`/categories/${id}/upload-image`, data);
}