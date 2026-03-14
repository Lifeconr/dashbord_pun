"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    CalendarCheck2, 
    MailOpen, 
    LogOut,
    ChevronRight,
    ShieldCheck
} from "lucide-react";

export default function SideBar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    const allLinks = [
        { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Employees", href: "/admin/users", icon: Users },
        { name: "Roles", href: "/admin/roles", icon: ShieldCheck },
        { name: "Teams", href: "/admin/teams", icon: Building2 },
        { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck2 },
        { name: "Leave Requests", href: "/admin/leaves", icon: MailOpen },
    ];

    const visibleLinks = allLinks;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col z-10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-10 pl-2">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-200/20">
                    <span className="text-white font-black text-lg">A</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">AttendManager</h2>
            </div>

            <nav className="flex-1 space-y-1.5">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-4 px-3">Platform</div>
                {visibleLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group font-bold text-sm ${
                                isActive 
                                    ? "bg-primary text-white shadow-md shadow-primary-200/20" 
                                    : "text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                                <span className="tracking-tight">{link.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 mt-auto">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

