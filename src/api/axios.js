import axios from 'axios';
const BASE_URL = 'https://t3-api2dev.vegan-masterclass.de/api';

export default axios.create({
    baseURL: BASE_URL
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
    params: {
        access_token: TOKEN
    }
});