import React from "react";

interface RoleBadgeProps {
    role: string;
    className?: string;
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
    // Generate colors based on common roles
    const getRoleStyles = (roleName: string) => {
        const lower = roleName.toLowerCase();
        if (lower.includes('admin')) return "bg-primary-200/10 text-primary border-primary-200/30";
        if (lower.includes('manager')) return "bg-blue-50 text-blue-700 border-blue-200";
        if (lower.includes('hr')) return "bg-pink-50 text-pink-700 border-pink-200";
        return "bg-slate-100 text-slate-700 border-slate-200"; // default for employee
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getRoleStyles(role)} ${className}`}>
            {role.replace(/_/g, ' ')}
        </span>
    );
}

// Also export a StatusBadge for attendance/general statuses
interface StatusBadgeProps {
    status: "active" | "suspended" | "on_time" | "late" | "absent" | "on_leave" | string;
    className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const getStatusStyles = (s: string) => {
        const lower = s.toLowerCase();
        // Attendance statuses matching user request
        if (lower === 'on_time') return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (lower === 'late') return "bg-amber-50 text-amber-700 border-amber-200";
        if (lower === 'absent') return "bg-rose-50 text-rose-700 border-rose-200";
        if (lower === 'on_leave') return "bg-cyan-50 text-cyan-700 border-cyan-200";
        
        // Account statuses
        if (lower === 'active') return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (lower === 'suspended') return "bg-rose-50 text-rose-700 border-rose-200";
        
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border flex items-center justify-center w-fit ${getStatusStyles(status)} ${className}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}
