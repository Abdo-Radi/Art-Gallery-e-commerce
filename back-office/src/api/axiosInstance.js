import axios from "axios"

const baseURL = "http://localhost:3002/v1"

const axiosInstance = axios.create({
    baseURL
})

export default axiosInstance