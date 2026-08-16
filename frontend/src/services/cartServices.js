import api from "./api"

export const cart = async () => {
    const response = await api.get("/cart");
    return response.data;
}

export const add = async (data) => {
    const response = await api.post("/cart", data)
}

export const update = async (id,quantity)=>{

}

export const clear = async () => {
    const response = await api.delete("/cart");
    return data;
}