// types/types.ts

/**
 * Primitive Types & Aliases
 */
export type ID = number; // Change to string | number if using UUIDs
export type UserId = ID;
export type TeamId = ID;
export type RoleId = ID;
export type PermissionId = ID;

/**
 * Standard API Response Wrapper
 */
export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

/**
 * Authentication Types
 */
export interface User {
    id: UserId;
    name: string;
    email: string;
    team_id?: TeamId | null;
    roles?: string[];
    permissions?: string[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

/**
* Team Types
 */
export interface Team {
    id: TeamId;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TeamData {
    name: string;
    description?: string;
}

/**
 * RBAC (Role-Based Access Control) Types
 */
export interface Role {
    id: RoleId;
    name: string;
    guard_name: string;
}

export interface RoleData {
    name: string;
    guard_name: string;
}

export interface Permission {
    id: PermissionId;
    name: string;
    guard_name: string;
}

export interface PermissionData {
    name: string;
    guard_name: string;
}

/**
 * Pivot / Assignment Types
 */
export interface UserRole {
    user_id: UserId;
    role_id: RoleId;
}

export interface UserPermission {
    user_id: UserId;
    permission_id: PermissionId;
}
