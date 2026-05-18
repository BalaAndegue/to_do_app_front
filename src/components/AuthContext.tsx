"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogoutService } from "@/lib";
import { UsersService } from "@/lib/services/UsersService";
import { User } from "@/lib/models/User";
import { AUTH_TOKEN_STORAGE_KEY, configureOpenApiClient } from "@/lib/api/client";

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    /** true until the client has read localStorage and resolved the initial user */
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Always start null so SSR and initial client render match (no hydration mismatch)
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (stored) {
            configureOpenApiClient(stored);
            setToken(stored);
            UsersService.usersMe()
                .then(setUser)
                .catch(() => {
                    // Token expired / invalid — clear it
                    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
                    setToken(null);
                    configureOpenApiClient(null);
                })
                .finally(() => setLoading(false));
        } else {
            configureOpenApiClient(null);
            setLoading(false);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, newToken);
        setToken(newToken);
        configureOpenApiClient(newToken);
        // Fetch user profile right after login
        UsersService.usersMe().then(setUser).catch(() => setUser(null));
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const me = await UsersService.usersMe();
            setUser(me);
        } catch {
            setUser(null);
        }
    };

    const logout = async () => {
        try { await LogoutService.logoutCreate(); } catch { /* ignore */ }
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
        configureOpenApiClient(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, refreshUser, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
