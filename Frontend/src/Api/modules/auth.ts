/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosClient"


export const Login = (data:any)=>{
    return axiosClient.post('/users/login',data);
}

export const Register = (data:any)=>{
    return axiosClient.post('/users/register',data);
}

export const ForgetPassword = (data:any)=>{
    return axiosClient.post('/users/forgot-password',data);
}

export const ResetPassword = (data:any)=>{
    return axiosClient.post('/users/reset-password',data);
}

export const ChangePassword = (id:number, data:any)=>{
    return axiosClient.post(`/users/${id}/change-password`,data);
}

export const Logout = ()=>{
    return axiosClient.post("/users/logout");
}


