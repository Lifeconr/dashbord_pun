"use client";

import React, { useState } from "react";
import AdminTable from "@/app/components/ui/AdminTable";
import RoleBadge, { StatusBadge } from "@/app/components/ui/RoleBadge";
import UserAvatar from "@/app/components/ui/UserAvatar";
import ModalForm from "@/app/components/ui/ModalForm";
import { Plus, MoreHorizontal, Filter, Layers, UserCircle2, Mail, MapPin } from "lucide-react";

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Static Realistic Data from screenshot and beyond
    const users = [
        { id: 1, name: "Stern Thireau", role: "Construction Foreman", email: "sthireau0@prlog.org", country: "Portugal", status: "Active" },
        { id: 2, name: "Ford McKibbin", role: "Project Manager", email: "fmckibbin1@slate.com", country: "Mexico", status: "Pending" },
        { id: 3, name: "Foss Roglieri", role: "Construction Expeditor", email: "frogm@xing.com", country: "Brazil", status: "Active" },
        { id: 4, name: "Maurits Elgey", role: "Construction Manager", email: "melgey3@blogger.com", country: "Poland", status: "Active" },
        { id: 5, name: "Hyacinth Batalle", role: "Surveyor", email: "hbatalle4@google.com", country: "Spain", status: "Active" },
        { id: 6, name: "Karly Garmonsway", role: "Project Engineer", email: "kgarm5@cbs.com", country: "USA", status: "Suspended" },
    ];

    const columns = [
        { 
            header: "Name", 
            accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    <UserAvatar name={item.name} />
                    <span className="font-extrabold text-slate-900">{item.name}</span>
                </div>
            ) 
        },
        { 
            header: "Role", 
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-slate-900 font-bold">{item.role}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Construction</span>
                </div>
            ) 
        },
        { 
            header: "Email", 
            accessor: "email" 
        },
        { 
            header: "Country", 
            accessor: (item: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                    <span>{item.country}</span>
                </div>
            )
        },
        { 
            header: "Status", 
            accessor: (item: any) => <StatusBadge status={item.status.toLowerCase()} />
        },
        { 
            header: "", 
            className: "text-right", 
            accessor: (item: any) => (
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 group-hover:text-slate-900">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            )
        }
    ];

    const filters = (
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest">
                <Plus className="w-3.5 h-3.5" />
                Status
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest">
                <Filter className="w-3.5 h-3.5" />
                Plan
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest">
                <Layers className="w-3.5 h-3.5" />
                Role
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employees</h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage your global workforce</p>
                </div>
                <div className="flex gap-3">
                    {/* <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <Layers className="w-4 h-4" />
                        Columns
                    </button> */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-sm font-black hover:bg-primary-200 transition-all shadow-lg shadow-primary-200/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Add New User
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <AdminTable<any>
                data={users}
                columns={columns}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search users..."
                filtersSlot={filters}
            />

            {/* Creation Modal */}
            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Employee"
                description="Fill in the details to add a new member to your workforce."
                onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}
                submitText="Create Employee"
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Full Name</label>
                        <div className="relative group">
                            <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                            <input type="text" className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-[--color-primary-200]/30 transition-all outline-none" placeholder="e.g. Stern Thireau" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-[--color-primary] transition-colors" />
                            <input type="email" className="w-full bg-slate-50 border-slate-100 rounded-xl pl-10.5 pr-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-[--color-primary-200]/30 transition-all outline-none" placeholder="name@company.com" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Team</label>
                            <input type="text" className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-[--color-primary-200]/30 transition-all outline-none" placeholder="e.g. Developers" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Role</label>
                            <select className="w-full bg-slate-50 border-slate-100 rounded-xl px-3 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-[--color-primary-200]/30 transition-all outline-none">
                                <option disabled selected>Select Role</option>
                                <option>Admin</option>
                                <option>Manager</option>
                                <option>User</option>
                            </select>
                        </div>
                    </div>
                </div>
            </ModalForm>
        </div>
    );
}
