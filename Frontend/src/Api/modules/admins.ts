/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosClient"

export const CreateAdmin = (data: any) => {
    return axiosClient.post('/users/create-admin', data);
}

export const GetAllOrders = () => {
    return axiosClient.get('/orders');
}

export const UpdateOrderStatus = (id: number, status: string) => {
    return axiosClient.patch(`/orders/${id}/status`, {status});
}

export const GetStatistics = () => {
    return axiosClient.get('/admin/statistics');
}

export const GetOrdersChartData = () => {
    return axiosClient.get('/admin/statistics/chart/orders');
}

export const GetLoginStats = () => {
    return axiosClient.get('/users/stats/logins');
}