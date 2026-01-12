import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// Helper function for API calls
const fetcher = async (url, params) => {
    const response = await api.get(url, { params });
    return response.data;
};

// --- User Data Hooks ---

export function useTransactions(params = {}) {
    return useQuery({
        queryKey: ["user", "transactions", params],
        queryFn: () => fetcher("/auth/transactions", params),
    });
}

export function useCustomers(params = {}) {
    return useQuery({
        queryKey: ["user", "customers", params],
        queryFn: () => fetcher("/auth/customers", params),
    });
}

export function useConversations(params = {}) {
    return useQuery({
        queryKey: ["user", "conversations", params],
        queryFn: () => fetcher("/auth/conversations", params),
    });
}
