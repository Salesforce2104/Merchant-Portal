import api from '@/lib/axios';

// Base path for admin API routes
// Your backend mounts the admin router at /api/admin/auth
const ADMIN_API_BASE = '/admin/auth';

export const AdminService = {
    // --- User Management ---

    // List all users
    getUsers: async ({ limit = 50, offset = 0 } = {}) => {
        console.log('[AdminService] getUsers called', { limit, offset });
        try {
            const response = await api.get(`${ADMIN_API_BASE}/users`, { params: { limit, offset } });
            console.log('[AdminService] getUsers success', response.data);
            return response.data;
        } catch (error) {
            console.error('AdminService.getUsers error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get single user
    getUserById: async (id) => {
        console.log('[AdminService] getUserById called', id);
        try {
            const response = await api.get(`${ADMIN_API_BASE}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`AdminService.getUserById error for ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Update user
    updateUser: async (id, data) => {
        console.log('[AdminService] updateUser called', { id, data });
        try {
            const response = await api.put(`${ADMIN_API_BASE}/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`AdminService.updateUser error for ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Invite User
    inviteUser: async ({ email, name }) => {
        console.log('[AdminService] inviteUser called', { email, name });
        try {
            const response = await api.post(`${ADMIN_API_BASE}/invite`, { email, name });
            console.log('[AdminService] inviteUser success', response.data);
            return response.data;
        } catch (error) {
            console.error('AdminService.inviteUser error:', error.response?.data || error.message);
            throw error;
        }
    },

    // --- God Mode (Merchant Proxy) ---

    // Get transactions for a specific merchant
    getMerchantTransactions: async (merchantId, params = {}) => {
        console.log('[AdminService] getMerchantTransactions called', { merchantId, params });
        try {
            const response = await api.get(`${ADMIN_API_BASE}/users/${merchantId}/transactions`, { params });
            return response.data;
        } catch (error) {
            console.error(`AdminService.getMerchantTransactions error for ${merchantId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Get customers for a specific merchant
    getMerchantCustomers: async (merchantId, params = {}) => {
        console.log('[AdminService] getMerchantCustomers called', { merchantId, params });
        try {
            const response = await api.get(`${ADMIN_API_BASE}/users/${merchantId}/customers`, { params });
            return response.data;
        } catch (error) {
            console.error(`AdminService.getMerchantCustomers error for ${merchantId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Get conversations for a specific merchant
    getMerchantConversations: async (merchantId, params = {}) => {
        console.log('[AdminService] getMerchantConversations called', { merchantId, params });
        try {
            const response = await api.get(`${ADMIN_API_BASE}/users/${merchantId}/conversations`, { params });
            return response.data;
        } catch (error) {
            console.error(`AdminService.getMerchantConversations error for ${merchantId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
