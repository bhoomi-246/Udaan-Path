import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Adding a simple interceptor for potential future auth token usage
api.interceptors.request.use(
    (config) => {
        // You could get a token from localStorage here and add it to headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
