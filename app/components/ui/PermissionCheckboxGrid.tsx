import React from "react";
import { Permission } from "@/types/types";

interface PermissionCheckboxGridProps {
    permissions: Permission[];
    userPermissions: string[];
    onToggle: (permission: Permission) => void;
    readOnly?: boolean;
}

export default function PermissionCheckboxGrid({ 
    permissions, 
    userPermissions, 
    onToggle, 
    readOnly = false 
}: PermissionCheckboxGridProps) {
    if (!permissions || permissions.length === 0) {
        return <p className="text-xs text-slate-400 italic">No permissions configured.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => {
                const isChecked = userPermissions.includes(perm.name);
                return (
                    <label 
                        key={perm.id} 
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            readOnly ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-slate-50'
                        } ${isChecked ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                        <div className="pt-0.5">
                            <input
                                type="checkbox"
                                className={`w-4 h-4 rounded text-slate-900 focus:ring-slate-900 bg-white border-slate-300 ${
                                    readOnly ? 'pointer-events-none' : ''
                                }`}
                                checked={isChecked}
                                onChange={() => !readOnly && onToggle(perm)}
                                readOnly={readOnly}
                            />
                        </div>
                        <div>
                            <span className={`block text-[10px] font-black uppercase tracking-widest ${isChecked ? 'text-white' : 'text-slate-900'}`}>
                                {perm.name.replace(/[-_]/g, ' ')}
                            </span>
                            <span className={`block text-[10px] font-medium mt-0.5 ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>
                                {perm.guard_name || 'web'} guard
                            </span>
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
