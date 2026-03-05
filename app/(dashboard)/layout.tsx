"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Placeholder */}
            <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col">
                <h2 className="text-xl font-bold mb-8">Dashboard</h2>
                <nav className="flex-1 space-y-2">
                    <a href="/dashboard" className="block p-2 hover:bg-gray-800 rounded transition">Home</a>
                    <a href="/teams" className="block p-2 hover:bg-gray-800 rounded transition">Teams</a>
                    {/* Only Admin see Users */}
                    {user?.roles?.includes("admin") && (
                        <a href="/users" className="block p-2 hover:bg-gray-800 rounded transition">Users</a>
                    )}
                </nav>
                <button
                    onClick={logout}
                    className="mt-auto p-2 bg-red-600 hover:bg-red-700 rounded transition text-sm font-medium"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-800">Welcome, {user?.name}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{user?.email}</span>
                        <div className="md:hidden">
                            <button onClick={logout} className="text-red-600 font-medium">Logout</button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
