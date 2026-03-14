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
import ModalForm from "@/app/components/ui/ModalForm";
import UserAvatar from "@/app/components/ui/UserAvatar";
import { ArrowLeft, UserPlus, Trash2, ShieldCheck } from "lucide-react";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleRemove = async (userId: number) => {
        if (!confirm("Remove this member from the department?")) return;
        try {
            const res = await removeTeamMember(teamId, userId);
            if (res.success) {
                fetchData();
            }
        } catch (err) {
            console.error("Failed to remove member", err);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;
        
        setIsSubmitting(true);
        try {
            const res = await addTeamMember(teamId, Number(selectedUserId));
            if (res.success) {
                setIsAddingMember(false);
                setSelectedUserId("");
                fetchData();
            }
        } catch (err) {
            console.error("Failed to add member", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-black text-slate-400 tracking-widest uppercase">Fetching Department Intel...</p>
        </div>
    );

    if (!team) return (
        <div className="p-12 text-center">
            <h1 className="text-2xl font-black text-slate-900">Department Not Found</h1>
            <button onClick={() => router.push('/admin/teams')} className="mt-4 text-primary font-bold hover:underline">Return to Registry</button>
        </div>
    );

    const nonMembers = allUsers.filter(user => !members.some(m => m.id === user.id));

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all active:scale-90"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{team.name}</h1>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg tracking-widest">Dept ID: {team.id}</span>
                        </div>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">{team.description || "Core organizational unit"}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddingMember(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Assign Member
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Members List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Personnel ({members.length})</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-slate-50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Roles</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-12 text-center">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No personnel assigned to this department yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 flex items-center gap-4">
                                                <UserAvatar name={member.name} className="w-10 h-10 shadow-sm" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{member.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Staff #{member.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-slate-500">{member.email}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {(member.roles || []).length > 0 ? (
                                                        member.roles?.map(role => (
                                                            <span key={role} className="px-2 py-1 rounded-md text-[9px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tighter">
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-slate-300 font-bold uppercase italic">Employee</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => handleRemove(member.id)} 
                                                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Remove from Team"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ModalForm 
                isOpen={isAddingMember} 
                onClose={() => setIsAddingMember(false)} 
                title="Assign Personnel"
                description={`Select an employee to add to the ${team.name} department.`}
                onSubmit={handleAddMember}
                submitText="Assign to Department"
                isSubmitting={isSubmitting}
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Select Employee</label>
                        <select
                            className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all outline-none appearance-none cursor-pointer"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            required
                        >
                            <option value="">Choose an employee...</option>
                            {nonMembers.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 italic">Only showing personnel not assigned to this department.</p>
                    </div>
                </div>
            </ModalForm>
        </div>
    );
}
