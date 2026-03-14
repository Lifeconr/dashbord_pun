"use client";

import React, { useState } from "react";
import PermissionCheckboxGrid, { PermissionModule } from "./PermissionCheckboxGrid";
import { CopyPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";



interface RoleFormProps {
    initialName?: string;
    initialPermissions?: string[];
    modules: PermissionModule[];
    onSubmit: (data: { name: string; permissions: string[] }) => void;
    onCancel: () => void;
}

export default function RoleForm({ initialName = "", initialPermissions = [], modules, onSubmit, onCancel }: RoleFormProps) {
    const [name, setName] = useState(initialName);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, permissions: selectedPermissions });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 sm:p-8 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-200/10 text-primary flex items-center justify-center rounded-xl shadow-inner border border-primary-200/20">
                        <CopyPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{initialName ? "Edit Role" : "Create Role"}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Define access levels and permissions</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-5 sm:p-8 space-y-8 flex-1">
                <div className="space-y-2 lg:w-1/2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-1">Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary-200/30 focus:border-primary transition-all outline-none" 
                        placeholder="e.g. Administrator" 
                        required
                    />
                </div>

                <div className="space-y-4">
                    <div className="pl-1">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Owner Permissions</label>
                        <p className="text-xs text-slate-500 font-medium mt-1">Select by module, feature, or individual action.</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner">
                        <div className="max-h-[500px] overflow-y-auto p-2">
                            <PermissionCheckboxGrid 
                                modules={modules} 
                                selectedPermissions={selectedPermissions}
                                onChange={setSelectedPermissions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center sm:justify-start gap-3 rounded-b-2xl">
                <button 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-200 text-white text-sm font-black rounded-xl transition-all shadow-md shadow-primary-200/20 active:scale-95"
                >
                    Create Role
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="w-full sm:w-auto px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </form>
    );
}
