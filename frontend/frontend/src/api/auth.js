import api from './axios.js';
import {AUTH_BASE} from '../config.js';

export const register = async (name, email, password) => {
    const {data} = await api.post(`${AUTH_BASE}/register` , {name, email, password});
    return data;
};

export const login = async(email, password) => {
    const {data} = await api.post (`${AUTH_BASE}/login` , {email, password});
    return data;
}