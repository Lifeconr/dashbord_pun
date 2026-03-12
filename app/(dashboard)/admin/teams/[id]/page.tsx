"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getTeam,
    getTeamMembers,
    getUsers,
    addTeamMember,
    removeTeamMember
} from "@/services/api";
import { Team, User } from "@/types/types";
import Modal from "@/app/components/ui/Modal";

export default function AdminTeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.slug || params.id;
    const teamId = Number(id);

    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [teamRes, membersRes, usersRes] = await Promise.all([
                getTeam(teamId),
                getTeamMembers(teamId),
                getUsers()
            ]);

            if (teamRes.success) setTeam(teamRes.data);
            if (membersRes.success) setMembers(membersRes.data);
            if (usersRes.success) setAllUsers(usersRes.data);
        } catch (err) {
            console.error("Error fetching team data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (teamId) fetchData();
    }, [teamId]);

    if (isLoading) return <div className="p-12 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">Loading Department Details...</div>;
    if (!team) return <div className="p-12 text-center text-red-500 font-bold">Team Not Found</div>;

    const nonMembers = allUsers.filter(user => !members.some(m => m.id === user.id));

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-sm hover:bg-slate-50 transition"
                    >
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{team.name}</h1>
                        <p className="text-slate-500 font-medium text-sm">{team.description || "No department description available."}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddingMember(true)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                    Assign Member
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Members ({members.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                                            {member.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{member.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {member.roles?.map(role => (
                                                <span key={role} className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest">
                                            Unassign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddingMember} onClose={() => setIsAddingMember(false)} title="Add Team Member">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Employee</label>
                        <select
                            className="w-full border-slate-200 rounded-xl focus:ring-slate-900 focus:border-slate-900 font-bold"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">Choose an employee...</option>
                            {nonMembers.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4">
                        <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-lg">
                            Add to Department
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
