"use client";

import React, { useEffect, useState } from "react";
import { getTeams, createTeam, deleteTeam } from "@/services/api";
import { Team } from "@/types/types";
import Modal from "@/app/components/ui/Modal";
import Link from "next/link";

export default function AdminTeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Departments & Teams</h1>
                    <p className="text-slate-500 mt-1">Manage organizational structure and team visibility.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                    + Create Team
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Members</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-24"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-50 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : (
                                teams.map((team) => (
                                    <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] uppercase">
                                                    {team.name.substring(0, 2)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{team.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                                                {team.description || "No description provided."}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                                ? members
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium lowercase tracking-tighter">
                                            {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/teams/${team.id}`}
                                                    className="p-2 text-slate-400 hover:text-slate-900 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button className="p-2 text-slate-400 hover:text-red-600 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Team">
                <form onSubmit={handleCreateTeam} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Team Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 font-bold"
                            placeholder="e.g. Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                        <textarea
                            className="w-full border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 h-24 resize-none font-medium"
                            placeholder="Briefly describe the team's responsibility..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-lg"
                        >
                            Confirm & Create Team
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
