import api from '@/lib/axios';

// Base path for user auth API routes
const AUTH_API_BASE = '/auth';

export const AuthService = {
    // Change password (authenticated user)
    changePassword: async ({ currentPassword, newPassword }) => {
        console.log('[AuthService] changePassword called');
        try {
            const response = await api.post(`${AUTH_API_BASE}/change-password`, {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('AuthService.changePassword error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Update Profile
    updateProfile: async (updates) => {
        console.log('[AuthService] updateProfile called', updates);
        try {
            const response = await api.put(`${AUTH_API_BASE}/me`, updates);
            return response.data;
        } catch (error) {
            console.error('AuthService.updateProfile error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Forgot password (initiate reset)
    forgotPassword: async (email, storeUrl) => {
        console.log('[AuthService] forgotPassword called', email, storeUrl);
        try {
            const response = await api.post(`${AUTH_API_BASE}/forgot-password`, { email, storeUrl });
            return response.data;
        } catch (error) {
            console.error('AuthService.forgotPassword error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async ({ token, newPassword, storeUrl }) => {
        console.log('[AuthService] resetPassword called');
        try {
            const response = await api.post(`${AUTH_API_BASE}/reset-password`, {
                token,
                newPassword,
                storeUrl
            });
            return response.data;
        } catch (error) {
            console.error('AuthService.resetPassword error:', error.response?.data || error.message);
            throw error;
        }
    }
};
