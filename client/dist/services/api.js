import axios from 'axios';
var API_URL = '/api';
var api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(function (config) {
    var token = localStorage.getItem('token');
    // Log token status (for debugging)
    if (token) {
        console.log("Adding token to request: ".concat(config.url));
        config.headers.Authorization = "Bearer ".concat(token);
    }
    else {
        console.warn("No token found for request: ".concat(config.url));
    }
    return config;
}, function (error) {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});
// Add a response interceptor to handle common errors
api.interceptors.response.use(function (response) {
    console.log("Response success: ".concat(response.config.url), response.status);
    return response;
}, function (error) {
    var _a, _b;
    console.error("Response error: ".concat((_a = error.config) === null || _a === void 0 ? void 0 : _a.url), (_b = error.response) === null || _b === void 0 ? void 0 : _b.status, error.message);
    if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access detected, redirecting to login');
        // Unauthorized, clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export default api;
