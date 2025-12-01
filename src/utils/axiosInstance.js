import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
