import axiosClient from "../axiosClient";

export const PlaceOrder = (UserId:number)=>{
    return axiosClient.post(`/orders/place/${UserId}`);
}
