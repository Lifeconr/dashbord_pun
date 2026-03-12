"use client";

import React from "react";
import StatCard from "@/app/components/ui/StatCard";
import ActivityTimeline, { ActivityItem } from "@/app/components/ui/ActivityTimeline";
import AdminTable from "@/app/components/ui/AdminTable";
import { Users, Building2, UserPlus, Clock, Ban, DollarSign, MoreHorizontal } from "lucide-react";
import { StatusBadge } from "@/app/components/ui/RoleBadge";

export default function AdminDashboard() {
    // Static Realistic Data for Approval
    const stats = [
        { title: "Total Employees", value: "1,248", icon: Users, trend: "up" as const, trendValue: "12%" },
        { title: "Active Today", value: "982", icon: UserPlus, trend: "up" as const, trendValue: "3%" },
        { title: "Total Teams", value: "42", icon: Building2, trend: "neutral" as const, trendValue: "0%" },
        { title: "Late Check-ins", value: "128", icon: Clock, trend: "down" as const, trendValue: "5%" },
        { title: "Total Absent", value: "14", icon: Ban, trend: "down" as const, trendValue: "2%" },
        { title: "Penalties Coll.", value: "$12,450", icon: DollarSign, trend: "up" as const, trendValue: "8%" },
    ];

    const recentAttendance = [
        { id: 1, name: "Stern Thireau", email: "sthireau0@prlog.org", time: "08:12 AM", status: "on_time", penalty: "$0.00" },
        { id: 2, name: "Ford McKibbin", email: "fmckibbin1@slate.com", time: "09:45 AM", status: "late", penalty: "$25.00" },
        { id: 3, name: "Foss Roglieri", email: "frogm@xing.com", time: "08:05 AM", status: "on_time", penalty: "$0.00" },
        { id: 4, name: "Maurits Elgey", email: "melgey3@blogger.com", time: "---", status: "absent", penalty: "$50.00" },
        { id: 5, name: "Hyacinth Batalle", email: "hbatalle4@google.com", time: "---", status: "on_leave", penalty: "$0.00" },
    ];

    const recentActions: ActivityItem[] = [
        { id: 1, title: "New Team Created", description: "Design Engineering team added by Admin", timestamp: "2 hours ago", type: "create" },
        { id: 2, title: "Role Modified", description: "Manager role updated for Stern Thireau", timestamp: "4 hours ago", type: "update" },
        { id: 3, title: "System Login", description: "Admin logged in from new IP", timestamp: "5 hours ago", type: "login" },
        { id: 4, title: "User Deleted", description: "Temporary account removed", timestamp: "Yesterday", type: "delete" },
    ];

    const attendanceColumns = [
        { 
            header: "Employee", 
            accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-xs font-black">
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{item.email}</p>
                    </div>
                </div>
            )
        },
        { header: "Time", accessor: "time" },
        { 
            header: "Status", 
            accessor: (item: any) => <StatusBadge status={item.status} />
        },
        { 
            header: "Penalty", 
            accessor: (item: any) => <span className={`font-black ${item.penalty !== '$0.00' ? 'text-rose-600' : 'text-slate-400'}`}>{item.penalty}</span>
        },
        { 
            header: "", 
            className: "text-right",
            accessor: () => (
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Real-time attendance & metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Main Activity Table */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs opacity-50">Recent Attendance</h2>
                        <button className="text-[10px] font-black text-slate-900 hover:text-[--color-primary] transition-colors uppercase tracking-widest">View Full History</button>
                    </div>
                    <AdminTable<any> 
                        data={recentAttendance} 
                        columns={attendanceColumns} 
                        keyExtractor={(item) => item.id}
                        searchable={false}
                    />
                </div>

                {/* System Actions Feed */}
                <div className="space-y-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs opacity-50 px-2">System Logs</h2>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full">
                        <ActivityTimeline activities={recentActions} />
                        <button className="w-full mt-8 py-3.5 bg-primary hover:bg-primary-200 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary-200/20 active:scale-95 mt-auto">
                            Full Audit Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
