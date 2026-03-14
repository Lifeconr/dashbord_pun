"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getUser,
    updateUser,
    getTeams,
    getRoles,
    getPermissions,
    assignRole,
    updateRole,
} from "@/services/api";
import { User, Team, Role, Permission } from "@/types/types";

export default function AdminEmployeeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = Number(params.id);

    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [userRes, teamsRes, rolesRes, permsRes] = await Promise.all([
                    getUser(userId),
                    getTeams(),
                    getRoles(),
                    getPermissions()
                ]);

                if (userRes.success) setUser(userRes.data);
                if (teamsRes.success) setTeams(teamsRes.data);
                if (rolesRes.success) setRoles(rolesRes.data);
                if (permsRes.success) setPermissions(permsRes.data);
            } catch (err) {
                console.error("Error fetching employee data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        try {
            const response = await updateUser(userId, {
                name: user.name,
                team_id: user.team_id
            });
            if (response.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            }
        } catch (err) {
            setMessage({ type: "error", text: "Update failed." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Employee Profile...</div>;
    if (!user) return <div className="p-12 text-center text-red-500 font-bold">Employee Not Found</div>;

    const tabs = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "roles", label: "Roles & Permissions", icon: "🔑" },
        { id: "attendance", label: "Attendance", icon: "📅" },
        { id: "leaves", label: "Leaves", icon: "✉️" },
        { id: "activity", label: "Activity", icon: "📜" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-sm hover:bg-slate-50 transition"
                >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                        <p className="text-slate-500 font-medium text-sm">{user.email} • ID: {user.id}</p>
                    </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 hover:text-slate-900 ${activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 font-medium'}`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest text-xs opacity-50">Basic Information</h2>
                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 font-bold text-slate-900"
                                                value={user.name}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Department</label>
                                            <select
                                                className="w-full border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 font-bold text-slate-900"
                                                value={user.team_id || ""}
                                                onChange={(e) => setUser({ ...user, team_id: e.target.value ? Number(e.target.value) : null })}
                                            >
                                                <option value="">No Team</option>
                                                {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Status</label>
                                            <div className="flex items-center gap-2 p-2.5 bg-green-50 text-green-700 rounded-xl border border-green-100 font-black text-[10px] uppercase">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Active Account
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition disabled:bg-slate-200"
                                        >
                                            {isSaving ? "Updating Profile..." : "Update Profile"}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200 text-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Quick Insights</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-3xl font-black">94%</p>
                                        <p className="text-[10px] uppercase font-bold opacity-60">Avg. Punctuality</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black">3</p>
                                        <p className="text-[10px] uppercase font-bold opacity-60">Leave Days Taken</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-red-400">$45.00</p>
                                        <p className="text-[10px] uppercase font-bold opacity-60">Total Penalties</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition">
                                Generate Full Report
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "roles" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest opacity-50">Administrative Roles</h2>
                            <div className="space-y-4">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900"
                                                checked={user.roles?.includes(role.name)}
                                                onChange={() => { }} // Integration logic
                                            />
                                            <span className="text-sm font-black uppercase text-slate-900">{role.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 italic">Global Access</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest opacity-50">Access Permissions Grid</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {permissions.map(perm => (
                                    <label key={perm.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        />
                                        <span className="text-[10px] font-black uppercase text-slate-700 truncate">{perm.name.replace(/-/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "attendance" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest opacity-50">Attendance History</h2>
                            <div className="flex gap-2">
                                <input type="date" className="text-[10px] font-bold border-slate-200 rounded-lg px-2 py-1" />
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Late</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Penalty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { date: "Oct 24, 2023", time: "08:15 AM", status: "on_time", late: 0, penalty: "$0.00" },
                                    { date: "Oct 23, 2023", time: "09:12 AM", status: "late", late: 42, penalty: "$20.00" },
                                    { date: "Oct 22, 2023", time: "---", status: "absent", late: 0, penalty: "$50.00" },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.date}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${row.status === 'on_time' ? 'bg-green-100 text-green-700' : row.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                {row.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.late > 0 ? `${row.late}m` : '-'}</td>
                                        <td className="px-6 py-4 text-sm font-black text-red-600 text-right">{row.penalty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
