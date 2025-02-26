import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = async (userData) => {
    return axios.post(`${API_BASE_URL}/signup/`, userData);
};

export const login = async (userData) => {
    return axios.post(`${API_BASE_URL}/login/`, userData);
};

export const fetchTasks = async (page = 1) => {
    return axios.get(`${API_BASE_URL}/tasks/?page=${page}`, {
        headers: getAuthHeaders(),
    });
};

export const createTask = async (task) => {
    return axios.post(`${API_BASE_URL}/tasks/`, task, {
        headers: getAuthHeaders(),
    });
};

export const updateTask = async (id, task) => {
    return axios.put(`${API_BASE_URL}/tasks/${id}/`, task, {
        headers: getAuthHeaders(),
    });
};

export const deleteTask = async (id) => {
    return axios.delete(`${API_BASE_URL}/tasks/${id}/`, {
        headers: getAuthHeaders(),
    });
};

export const requestPasswordReset = async (email) => {
    return axios.post(`${API_BASE_URL}/password-reset/`, { email });
};

export const resetPassword = async (uid, token, password) => {
    return axios.post(`${API_BASE_URL}/password-reset-confirm/${uid}/${token}/`, { password });
};
