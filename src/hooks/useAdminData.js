import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/adminService";
import api from "@/lib/axios";

// --- Admin Hooks ---

// Fetch all users/stores
export function useStores(params = {}) {
    // Create a unique query key including parameters used for filtering/pagination
    const queryKey = ["admin", "users", params];

    return useQuery({
        queryKey,
        queryFn: () => AdminService.getUsers(params),
        keepPreviousData: true, // Useful for pagination
    });
}

// Fetch single user
export function useUser(userId) {
    return useQuery({
        queryKey: ["admin", "users", userId],
        queryFn: () => AdminService.getUserById(userId),
        enabled: !!userId, // Only fetch if ID exists
    });
}

// Mutation to update user (OTHER users/merchants)
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => AdminService.updateUser(id, data),
        onSuccess: (_, variables) => {
            // Invalidate relevant queries to trigger refetch
            queryClient.invalidateQueries(["admin", "users"]);
            if (variables.id) {
                queryClient.invalidateQueries(["admin", "users", variables.id]);
            }
        },
    });
}

// Mutation to update Admin's OWN profile (uses /me endpoint)
export function useUpdateAdminProfile() {
    return useMutation({
        mutationFn: (data) => AdminService.updateAdminProfile(data),
    });
}

export function useInviteMerchant() {
    // No specific invalidation needed usually, or invalidate 'users' if it adds to list immediately
    return useMutation({
        mutationFn: (data) => AdminService.inviteUser(data),
    })
}

// --- Merchant Data Hooks (God Mode) ---

export function useMerchantTransactions(merchantId, params = {}) {
    return useQuery({
        queryKey: ["admin", "transactions", merchantId, params],
        queryFn: () => AdminService.getMerchantTransactions(merchantId, params),
        enabled: !!merchantId,
    });
}

export function useMerchantCustomers(merchantId, params = {}) {
    return useQuery({
        queryKey: ["admin", "customers", merchantId, params],
        queryFn: () => AdminService.getMerchantCustomers(merchantId, params),
        enabled: !!merchantId,
    });
}

export function useMerchantConversations(merchantId, params = {}) {
    return useQuery({
        queryKey: ["admin", "conversations", merchantId, params],
        queryFn: () => AdminService.getMerchantConversations(merchantId, params),
        enabled: !!merchantId,
    });
}

// Global Stats
export function useAllTransactions(params = {}) {
    return useQuery({
        queryKey: ["admin", "allTransactions", params],
        queryFn: () => AdminService.getAllTransactions(params),
    });
}
