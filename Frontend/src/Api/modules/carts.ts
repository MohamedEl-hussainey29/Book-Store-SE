/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosClient";

export const GetCart = (userId:number) => {
    return axiosClient.get(`/cart/${userId}`);
}
export const AddToCart = (userId:number,data: any) => {
    return axiosClient.post(`/cart/${userId}/items`, data);
}

export const UpdateQuantity = (userId:number,bookId:number,{quantity}:any) => {
    return axiosClient.put(`/cart/${userId}/items/${bookId}`, {quantity});
}

export const RemoveItem = (userId:number,bookId:number) => {
    return axiosClient.delete(`/cart/${userId}/items/${bookId}`);
}

export const ClearCart = (userId:number) => {
    return axiosClient.delete(`/cart/${userId}/clear`);
}