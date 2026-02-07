"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { OpenAPI } from "@/lib";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        if (savedToken) {
            setToken(savedToken);
            OpenAPI.TOKEN = savedToken;
        }
        setLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("auth_token", newToken);
        setToken(newToken);
        OpenAPI.TOKEN = newToken;
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
        OpenAPI.TOKEN = undefined;
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
