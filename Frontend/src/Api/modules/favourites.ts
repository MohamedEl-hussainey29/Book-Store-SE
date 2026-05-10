import axiosClient from "../axiosClient"


export const GetFavourites = (id:number)=>{
    return axiosClient.get(`/favourites/user/${id}`);
}

export const AddToFavourites = (userId:number , bookId:number) =>{
    return axiosClient.post(`/favourites/${userId}/books/${bookId}`)
}

export const RemoveFromFavourites = (userId:number , bookId:number) =>{
    return axiosClient.delete(`/favourites/${userId}/books/${bookId}`)
}