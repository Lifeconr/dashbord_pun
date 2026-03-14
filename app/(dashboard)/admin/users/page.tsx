"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminTable from "@/app/components/ui/AdminTable";
import RoleBadge from "@/app/components/ui/RoleBadge";
import UserAvatar from "@/app/components/ui/UserAvatar";
import ModalForm from "@/app/components/ui/ModalForm";
import { Plus, MoreHorizontal, UserCircle2, Mail, Users, ShieldCheck, Edit2, Trash2, KeyRound } from "lucide-react";
import { getUsers, getTeams, getRoles, createUser, updateUser, deleteUser, assignRole } from "@/services/api";
import { User, Team, Role } from "@/types/types";

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    // API Data
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    
    // Autocomplete Team States
    const [teamSearch, setTeamSearch] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);
    const teamDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name);
            setEmail(editingUser.email);
            setPassword(""); // Don't pre-fill password for security/empty means no change
            
            const roleName = getRoleName(editingUser.roles);
            setSelectedRole(roleName === "No Role" ? "" : roleName);
            
            const team = teams.find(t => t.id === editingUser.team_id);
            if (team) {
                setTeamSearch(team.name);
                setSelectedTeamId(team.id);
            } else {
                setTeamSearch("");
                setSelectedTeamId(null);
            }
            setIsModalOpen(true);
        }
    }, [editingUser, teams]);

    useEffect(() => {
        fetchData();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
                setShowTeamDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, teamsRes, rolesRes] = await Promise.all([
                getUsers(),
                getTeams(),
                getRoles()
            ]);
            
            if (usersRes.success && Array.isArray(usersRes.data)) setUsers(usersRes.data);
            if (teamsRes.success && Array.isArray(teamsRes.data)) setTeams(teamsRes.data);
            if (rolesRes.success && Array.isArray(rolesRes.data)) setRoles(rolesRes.data);
        } catch (error) {
            console.error("Failed to fetch users page data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = { name, email };
            if (password) payload.password = password;
            if (selectedTeamId !== undefined) payload.team_id = selectedTeamId;
            
            let res;
            if (editingUser) {
                res = await updateUser(editingUser.id, payload);
            } else {
                res = await createUser(payload);
            }
            
            if (res.success && res.data) {
                const updatedUser = res.data;
                // Assign Role explicitly via endpoint if selected or changed
                if (selectedRole) {
                    try {
                        await assignRole(updatedUser.id, selectedRole);
                    } catch (roleErr) {
                        console.error("Failed to assign role to user", roleErr);
                    }
                }
                
                setIsModalOpen(false);
                setEditingUser(null);
                resetForm();
                fetchData();
            }
        } catch (err) {
            console.error("Failed to save user", err);
            alert("Failed to save user. Please verify your inputs.");
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await deleteUser(userId);
            if (res.success) {
                fetchData();
            }
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Cannot delete user.");
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setTeamSearch("");
        setSelectedTeamId(null);
        setSelectedRole("");
    };

    // Filtered teams for the autocomplete dropdown
    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()));

    // Helper to extract role name robustly
    const getRoleName = (userRoleData: any) => {
        // userRoleData can be array of objects [{id, name...}] or array of strings
        if (!userRoleData || !Array.isArray(userRoleData) || userRoleData.length === 0) return "No Role";
        const role = userRoleData[0];
        return typeof role === "string" ? role : (role.name || "No Role");
    };

    // Filter Users for the Table
    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        const roleStr = getRoleName(user.roles).toLowerCase();
        
        // Find team name from teams list using team_id
        const teamMatch = teams.find(t => t.id === user.team_id);
        const teamStr = teamMatch ? teamMatch.name.toLowerCase() : "";

        return user.name.toLowerCase().includes(query) ||
               user.email.toLowerCase().includes(query) ||
               roleStr.includes(query) ||
               teamStr.includes(query);
    });

    const columns = [
        { 
            header: "Name", 
            accessor: (item: User) => (
                <div className="flex items-center gap-3">
                    <UserAvatar name={item.name} />
                    <span className="font-extrabold text-slate-900">{item.name}</span>
                </div>
            ) 
        },
        { 
            header: "Email", 
            accessor: "email" 
        },
        { 
            header: "Team", 
            accessor: (item: User) => {
                const team = teams.find(t => t.id === item.team_id);
                return (
                    <div className="flex flex-col">
                        <span className="text-slate-900 font-bold">{team ? team.name : "Unassigned"}</span>
                        {team && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">ID: {team.id}</span>}
                    </div>
                );
            }
        },
        { 
            header: "Role", 
            accessor: (item: User) => {
                const roleName = getRoleName(item.roles);
                if (roleName === "No Role") return <span className="text-slate-400 text-sm font-medium italic">Unassigned</span>;
                return <RoleBadge role={roleName} />;
            }
        },
        { 
            header: "Actions", 
            className: "text-right", 
            accessor: (item: User) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingUser(item)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary-200/10 rounded-xl transition-all" 
                        title="Edit User"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" 
                        title="Delete User"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employees</h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage your global workforce</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setEditingUser(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-sm font-black hover:bg-primary-200 transition-all shadow-lg shadow-primary-200/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Employee
                    </button>
                </div>
            </div>

            {/* Table Area */}
            {isLoading ? (
                <div className="w-full h-96 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-bold text-slate-400 tracking-widest uppercase">Loading Workforce Data...</p>
                </div>
            ) : (
                <AdminTable<User>
                    data={filteredUsers}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    searchPlaceholder="Search by name, email, team, or role..."
                    onSearch={setSearchQuery}
                    emptyMessage="No employees found matching your criteria."
                />
            )}

            {/* Creation Modal */}
            <ModalForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                    resetForm();
                }}
                title={editingUser ? "Edit Employee" : "Create New Employee"}
                description={editingUser ? `Update details for ${editingUser.name}.` : "Fill in the details to add a new member to your workforce."}
                onSubmit={handleSubmit}
                submitText={editingUser ? "Save Changes" : "Create Employee"}
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Full Name</label>
                        <div className="relative group">
                            <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none" 
                                placeholder="e.g. John Doe" 
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none" 
                                placeholder="name@company.com" 
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">{editingUser ? "New Password (Leave blank to keep current)" : "Temporary Password"}</label>
                        <div className="relative group">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                            <input 
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none" 
                                placeholder={editingUser ? "Empty means no change" : "Must be at least 6 characters"} 
                                required={!editingUser}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dynamic Team Autocomplete */}
                        <div className="space-y-1.5 relative" ref={teamDropdownRef}>
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Assign Team</label>
                            <div className="relative group">
                                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                                <input 
                                    type="text"
                                    value={teamSearch}
                                    onChange={(e) => {
                                        setTeamSearch(e.target.value);
                                        setSelectedTeamId(null);
                                        setShowTeamDropdown(true);
                                    }}
                                    onFocus={() => setShowTeamDropdown(true)}
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none" 
                                    placeholder="Search team..." 
                                />
                            </div>
                            
                            {/* Autocomplete Dropdown */}
                            {showTeamDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredTeams.length > 0 ? (
                                        <div className="p-1">
                                            {filteredTeams.map(team => (
                                                <div 
                                                    key={team.id}
                                                    onClick={() => {
                                                        setSelectedTeamId(team.id);
                                                        setTeamSearch(team.name);
                                                        setShowTeamDropdown(false);
                                                    }}
                                                    className="px-3 py-2 hover:bg-slate-50 cursor-pointer rounded-lg text-sm font-bold text-slate-700 transition-colors"
                                                >
                                                    {team.name}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                                            No teams found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dynamic Role Select */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Initial Role</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 transition-all outline-none appearance-none"
                                >
                                    <option value="">No Role Assigned</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalForm>
        </div>
    );
}
