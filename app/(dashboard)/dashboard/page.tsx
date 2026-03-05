"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium">Logged in as</h3>
                    <p className="text-2xl font-bold">{user?.name}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium">Your Role</h3>
                    <p className="text-2xl font-bold capitalize">{user?.roles?.[0] || "User"}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium">Team ID</h3>
                    <p className="text-2xl font-bold">{user?.team_id || "None"}</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Verification Steps</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Check if the URL is <code>/dashboard</code> after login.</li>
                    <li>Verify that the sidebar only shows your role-specific items.</li>
                    <li>Try to access <code>/login</code> while logged in (it should redirect you here).</li>
                    <li>Click Logout to clear the session.</li>
                </ul>
            </div>
        </div>
    );
}
