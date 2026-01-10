import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY, ADMIN_AUTH_TOKEN_KEY } from './constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Request Interceptor: Attach token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            // Check for User Token first, then Admin Token
            // This assumes a user is logged in as one or the other, or if both, User takes precedence for now
            // But actually, if we are on an admin page, we might want admin token.
            // Since we don't pass context easily here without complexity, 
            // and we separated logic:
            // - User login clears Admin token? No, smart navbar clears clear both on logout.
            // Let's grab whichever exists.

            const token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401/403 (Optional: Global Error Handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we just reject the promise so the component can handle it
            // In a real app, you might trigger a global logout state here
        }
        return Promise.reject(error);
    }
);

export default api;
