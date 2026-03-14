"use client";

import React, { useEffect, useState } from "react";
import { getTeams, createTeam, deleteTeam } from "@/services/api";
import { Team } from "@/types/types";
import ModalForm from "@/app/components/ui/ModalForm";
import UserAvatar from "@/app/components/ui/UserAvatar";
import Link from "next/link";
import { Plus, Eye, Trash2 } from "lucide-react";

export default function AdminTeamsPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [error, setError] = useState("");

    const fetchTeams = async () => {
        setIsLoading(true);
        try {
            const response = await getTeams();
            if (response.success) {
                setTeams(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch teams", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const response = await createTeam(formData);
            if (response.success) {
                setIsModalOpen(false);
                setFormData({ name: "", description: "" });
                fetchTeams();
            } else {
                setError(response.message || "Failed to create team");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeam = async (id: number) => {
        if (!confirm("Are you sure you want to delete this team?")) return;
        try {
            const res = await deleteTeam(id);
            if (res.success) fetchTeams();
        } catch (err) {
            console.error("Failed to delete team", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Departments</h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage organizational structure</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: "", description: "" });
                        setError("");
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create New Team
                </button>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-full w-24"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-5 bg-slate-100 rounded w-16 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : (
                                teams.map((team) => (
                                    <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                                    {team.name.substring(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{team.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {team.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-500 line-clamp-1 max-w-xs">
                                                {team.description || "No description provided."}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex -space-x-3 mr-3">
                                                    {(team.members || []).slice(0, 4).map((m: any, idx: number) => (
                                                        <div key={m.id} className="relative group" style={{ zIndex: 10 - idx }}>
                                                            <UserAvatar 
                                                                name={m.name} 
                                                                className="w-8 h-8 border-2 border-white shadow-sm hover:translate-y-[-2px] transition-transform" 
                                                            />
                                                        </div>
                                                    ))}
                                                    {(team.members_count || 0) > 4 && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 z-0">
                                                            +{(team.members_count || 0) - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                {(team.members_count || 0) > 0 ? (
                                                    <span className="text-xs font-bold text-slate-400">{team.members_count} active</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-400 italic">No members</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 transition-all duration-300">
                                                <Link
                                                    href={`/admin/teams/${team.id}`}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary-200/10 rounded-xl transition-all"
                                                    title="View Team"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteTeam(team.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" 
                                                    title="Delete Team"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Team"
                description="Establish a new department or functional group."
                onSubmit={handleCreateTeam}
                submitText="Confirm & Create Team"
                isSubmitting={isSubmitting}
            >
                <div className="space-y-4">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-xl">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Team Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none"
                            placeholder="e.g. Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Description</label>
                        <textarea
                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none h-28 resize-none"
                            placeholder="Briefly describe the team's responsibility..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </ModalForm>
        </div>
    );
}
