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

    // Update user (for editing OTHER users/merchants)
    updateUser: async (id, data) => {
        console.log('[AdminService] updateUser called', { id, data });
        console.log(`[AdminService] URL: ${ADMIN_API_BASE}/users/${id}`);
        try {
            const response = await api.put(`${ADMIN_API_BASE}/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`AdminService.updateUser error for ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Update Admin's OWN profile (uses /me endpoint, ID from token)
    updateAdminProfile: async (data) => {
        console.log('[AdminService] updateAdminProfile called', data);
        try {
            const response = await api.put(`${ADMIN_API_BASE}/me`, data);
            return response.data;
        } catch (error) {
            console.error('AdminService.updateAdminProfile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get Admin's OWN profile (fetches fresh data from backend)
    getAdminProfile: async () => {
        console.log('[AdminService] getAdminProfile called');
        try {
            const response = await api.get(`${ADMIN_API_BASE}/me`);
            return response.data;
        } catch (error) {
            console.error('AdminService.getAdminProfile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Change Admin's password
    changeAdminPassword: async ({ currentPassword, newPassword }) => {
        console.log('[AdminService] changeAdminPassword called');
        try {
            const response = await api.post(`${ADMIN_API_BASE}/change-password`, {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('AdminService.changeAdminPassword error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Forgot password - initiate reset
    forgotPassword: async (email) => {
        console.log('[AdminService] forgotPassword called', email);
        try {
            const response = await api.post(`${ADMIN_API_BASE}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            console.error('AdminService.forgotPassword error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async ({ token, newPassword }) => {
        console.log('[AdminService] resetPassword called');
        try {
            const response = await api.post(`${ADMIN_API_BASE}/reset-password`, {
                token,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('AdminService.resetPassword error:', error.response?.data || error.message);
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
    },

    // --- Aggregated Data ---

    // Get ALL transactions (system wide)
    getAllTransactions: async (params = {}) => {
        console.log('[AdminService] getAllTransactions called', params);
        try {
            // Attempt to hit the admin transactions endpoint
            // Assuming strict pattern: /admin/auth/transactions OR /admin/transactions
            // Based on base: /admin/auth
            const response = await api.get(`${ADMIN_API_BASE}/transactions`, { params });
            return response.data;
        } catch (error) {
            console.error('AdminService.getAllTransactions error:', error.response?.data || error.message);
            // Fallback or empty return if route doesn't exist, but we assume it does based on user query
            throw error;
        }
    }
};
