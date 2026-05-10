import axiosClient from "../axiosClient";

export const GetAllUsers = () => {
    return axiosClient.get('/users');
}

// ✅ جيب يوزر واحد بالـ ID — بيرجع كل الـ fields بما فيها role
export const GetUserById = (id: number) => {
    return axiosClient.get(`/users/${id}`);
}

export const UpdateUserProfile = (id: number, data: FormData) => {
    return axiosClient.put(`/users/${id}`, data);
}

export const DeleteUser = (id: number) => {
    return axiosClient.delete(`/users/${id}`);
}