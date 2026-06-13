import api from '../api/config';
// import { Product } from '../types';

export const UserService = {

    createUser: async (userData: { firstName: string; lastName: string; email: string; password: string; }) => {
        const response = await api.post('api/User/register', userData);
        return response.data;
    },

    loginUser: async (credentials: { email: string; password: string; }) => {
        const response = await api.post('api/User/login', credentials);
        return response.data;
    },
    getUser: async () => {
        const response = await api.get('api/User/profile/get');
        return response.data;
    },
    UpdateProfile: async (profileData: { 
        firstName?: string; 
        lastName?: string; 
        phoneNumber?: string; 
        address?: { 
            landmark: string;
            area: string;
            city: string;
            state: string;
            pincode: string;
        }; 
    }) => {
        const response = await api.put('api/User/profile/update', profileData);
        return response.data;
    }

};