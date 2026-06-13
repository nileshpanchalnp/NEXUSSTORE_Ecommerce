import api from '../api/config';

export const OrderService = {
    // Fetch all orders for the logged-in user
    getUserOrders: async () => {
        const response = await api.get('api/order/all'); // Adjust endpoint to your API
        console.log("check order get",response.data);
        return response.data;

    },

    // Fetch details for a specific order
    getOrderDetails: async (orderId: string) => {
        const response = await api.get(`api/order/oneorder/${orderId}`);
        return response.data;
    }
};