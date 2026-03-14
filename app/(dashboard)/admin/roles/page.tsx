"use client";

import React, { useState, useEffect } from "react";
import RoleForm from "@/app/components/ui/RoleForm";
import AdminTable from "@/app/components/ui/AdminTable";
import { Plus, Shield, ShieldCheck, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { getRoles, getPermissions, createRole, deleteRole, updateRole } from "@/services/api";
import { Role, Permission } from "@/types/types";
import { PermissionModule } from "@/app/components/ui/PermissionCheckboxGrid";

export default function RolesPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [permissionModules, setPermissionModules] = useState<PermissionModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                getRoles(),
                getPermissions()
            ]);
            
            if (rolesRes.success && rolesRes.data) {
                setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
            }
            if (permsRes.success && permsRes.data) {
                const perms = Array.isArray(permsRes.data) ? permsRes.data : [];
                setPermissions(perms);
                setPermissionModules(buildModules(perms));
            }
        } catch (error) {
            console.error("Failed to fetch roles & permissions", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to group flat permissions into the UI structure
    const buildModules = (perms: Permission[]): PermissionModule[] => {
        const modulesMap: Record<string, any> = {};

        perms.forEach(perm => {
            // Split by standard delimiters used in names e.g. "user.create" or "user_view"
            const parts = perm.name.split(/[\.\-\_:]/);
            
            let moduleName = "SYSTEM APP";
            let featureName = "General Actions";
            let actionLabel = perm.name;

            if (parts.length >= 2) {
                moduleName = parts[0].toUpperCase();
                featureName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                actionLabel = parts.slice(1).join(" ");
                actionLabel = actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1);
            } else {
                actionLabel = perm.name.charAt(0).toUpperCase() + perm.name.slice(1);
            }

            if (!modulesMap[moduleName]) {
                modulesMap[moduleName] = { name: moduleName, featuresMap: {} };
            }

            if (!modulesMap[moduleName].featuresMap[featureName]) {
                modulesMap[moduleName].featuresMap[featureName] = { name: featureName, actions: [] };
            }

            // Using permission 'name' instead of 'id' because Spatie can assign features by name or id safely,
            // string id here maps seamlessly to standard string actions the form handles.
            modulesMap[moduleName].featuresMap[featureName].actions.push({
                id: perm.name, 
                label: actionLabel
            });
        });

        return Object.values(modulesMap).map((m: any) => ({
            name: m.name,
            features: Object.values(m.featuresMap)
        }));
    };

    const handleSubmit = async (data: { name: string; permissions: string[] }) => {
        try {
            let res;
            if (editingRole) {
                res = await updateRole(editingRole.id, { name: data.name, permissions: data.permissions });
            } else {
                res = await createRole({ name: data.name, permissions: data.permissions });
            }
            
            if (res.success) {
                setIsCreating(false);
                setEditingRole(null);
                fetchData(); // Refresh list immediately
            }
        } catch (error) {
            console.error("Failed to save role", error);
            alert("Failed to save role. Please check console.");
        }
    };

    const handleDelete = async (roleId: string | number) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            const res = await deleteRole(roleId as number);
            if (res.success) {
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete role", error);
            alert("Failed to delete role. It might be in use.");
        }
    };

    const roleColumns = [
        {
            header: "Role Name",
            accessor: (item: Role) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-200/10 flex items-center justify-center border border-primary-200/30">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-extrabold text-slate-900">{item.name}</span>
                </div>
            )
        },
  
        {
            header: "Actions",
            className: "text-right",
            accessor: (item: Role) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingRole(item)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary-200/10 rounded-xl transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filteredRoles = roles.filter(role => 
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-bold text-slate-400 tracking-widest uppercase">Loading Role Data...</p>
            </div>
        );
    }

    if (isCreating || editingRole) {
        return (
            <div className="max-w-4xl mx-auto py-2 animate-in fade-in zoom-in-95 duration-500">
                <RoleForm 
                    initialName={editingRole?.name || ""}
                    initialPermissions={(editingRole as any)?.permissions?.map((p: any) => typeof p === 'string' ? p : p.name) || []}
                    modules={permissionModules}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsCreating(false);
                        setEditingRole(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage system access levels</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-black hover:bg-primary-200 transition-all shadow-lg shadow-primary-200/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create New Role
                </button>
            </div>
            
            {roles.length > 0 ? (
                <div className="space-y-4">
                    <AdminTable<Role>
                        data={filteredRoles}
                        columns={roleColumns}
                        keyExtractor={(item) => item.id}
                        searchPlaceholder="Search roles..."
                        onSearch={setSearchQuery}
                        emptyMessage="No roles found."
                    />
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-primary-200/10 rounded-full flex items-center justify-center mb-5 border border-primary-200/20">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No custom roles defined</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 max-w-sm">Create specific roles and finely tune their permissions to manage your workforce's access levels.</p>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            )}
        </div>
    );
}
