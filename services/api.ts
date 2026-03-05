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
