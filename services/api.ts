// services/api.ts
import axios from "axios";
import {
    User,
    UserId,
    LoginData,
    AuthResponse,
    Team,
    TeamId,
    TeamData,
    ApiResponse,
    Role,
    RoleId,
    Permission,
    PermissionId,
} from "@/types/types";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void, reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Catch 401 Unauthorized errors only, and prevent infinite loops with _retry flag
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If the endpoint that triggered 401 is /login or /refresh, let it fail
            if (originalRequest.url === '/login' || originalRequest.url === '/refresh') {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If currently refreshing, wait for it to finish and then retry the request
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to get a new token cookie from the backend
                await api.post('/refresh');

                // Success: Process queued requests
                isRefreshing = false;
                processQueue(null);

                // Retry the original failed request
                return api(originalRequest);

            } catch (refreshError) {
                // If the refresh token ALSO fails (e.g., completely expired), force logout
                processQueue(refreshError, null);
                
                // ONLY redirect if we are NOT already on the login page!
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


/**
 * Authentication Services
 */
export const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post("/login", data);
    return response.data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/me");
    return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
    const response = await api.post("/logout");
    return response.data;
};

/**
 * Teams Services (mapped to apiResource)
 */
export const getTeams = async (): Promise<ApiResponse<Team[]>> => {
    const response = await api.get("/teams");
    return response.data;
};

export const getTeam = async (id: TeamId): Promise<ApiResponse<Team>> => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
};

export const createTeam = async (data: TeamData): Promise<ApiResponse<Team>> => {
    const response = await api.post("/teams", data);
    return response.data;
};

export const updateTeam = async (id: TeamId, data: TeamData): Promise<ApiResponse<Team>> => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
};

export const deleteTeam = async (id: TeamId): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
};

export const getTeamMembers = async (id: TeamId): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/teams/${id}/members`);
    return response.data;
};

export const addTeamMember = async (teamId: TeamId, userId: UserId): Promise<ApiResponse<null>> => {
    const response = await api.post(`/teams/${teamId}/members`, { user_id: userId });
    return response.data;
};

export const removeTeamMember = async (teamId: TeamId, userId: UserId): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
};

/**
 * Users Services (mapped to apiResource)
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users`);
    return response.data;
}

export const getUser = async (id: UserId): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
}

export const createUser = async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.post(`/users`, data);
    return response.data;
}

export const updateUser = async (id: UserId, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
}

export const deleteUser = async (id: UserId): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

/**
 * Role & Permission Services (Spatie Integration)
 */
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get(`/roles`);
    return response.data;
}

export const assignRole = async (userId: UserId, roleId: RoleId): Promise<ApiResponse<null>> => {
    const response = await api.post(`/users/${userId}/roles`, { role_id: roleId });
    return response.data;
}

export const unassignRole = async (userId: UserId, roleId: RoleId): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${userId}/roles/${roleId}`);
    return response.data;
}

export const getPermissions = async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get(`/permissions`);
    return response.data;
}

export const assignPermission = async (userId: UserId, permissionId: PermissionId): Promise<ApiResponse<null>> => {
    const response = await api.post(`/users/${userId}/permissions`, { permission_id: permissionId });
    return response.data;
}

export const unassignPermission = async (userId: UserId, permissionId: PermissionId): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${userId}/permissions/${permissionId}`);
    return response.data;
}
