"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginData, AuthResponse, ApiResponse } from "@/types/types";
import { api, login as apiLogin, getMe, logout as apiLogout } from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosResponse, AxiosError } from "axios";


interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Axios Interceptor for 401 handling (Expired Token Trap)
        const interceptor = api.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {

                    setUser(null);
                    // Optionally clear cookies if the backend doesn't do it automatically
                    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    router.push("/login");
                }
                return Promise.reject(error);
            }
        );

        const initAuth = async () => {
            try {
                const response = await getMe();
                if (response.success) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [router]);


    const login = async (data: LoginData) => {
        try {
            const response = await apiLogin(data);
            if (response.success) {
                setUser(response.data.user);
                // Note: Token is handled by the backend via httpOnly cookie
                // if the backend response includes a token, it might be for local storage
                // or the backend sets a cookie. We respect the backend logic.
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
