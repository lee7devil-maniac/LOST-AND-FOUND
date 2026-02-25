import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

console.log('--- SYSTEM CONNECTIVITY AUDIT ---');
console.log('API Target:', API_BASE_URL);
console.log('Mode:', import.meta.env.MODE);
console.log('--------------------------------');

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
