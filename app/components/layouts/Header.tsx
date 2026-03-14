"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Bell, Search, Sun, Settings, ChevronRight } from "lucide-react";

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter(p => p && p !== 'admin');

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 py-3.5 flex items-center justify-between">
            
            <div className="flex items-center gap-6">
                {/* Search Bar matching screenshot */}
                <div className="relative group hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-slate-100/80 border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 rounded-xl pl-10 pr-4 py-2 text-sm font-medium transition-all w-64"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">⌘ K</kbd>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs">
                    <Link href="/admin/dashboard" className="text-slate-400 hover:text-primary font-bold uppercase tracking-widest text-[10px] transition-colors">Admin</Link>
                    {pathSegments.map((segment, index) => {
                        const href = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathSegments.length - 1;
                        return (
                            <React.Fragment key={href}>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                {isLast ? (
                                    <span className="text-slate-900 font-extrabold capitalize">{segment.replace(/-/g, ' ')}</span>
                                ) : (
                                    <Link href={href} className="text-slate-400 hover:text-primary font-bold uppercase tracking-widest text-[10px] transition-colors">
                                        {segment.replace(/-/g, ' ')}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 border-r border-slate-100 pr-5">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                        <Sun className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user?.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{user?.roles?.[0] || 'Administrator'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black shadow-sm group-hover:border-slate-900 transition-all overflow-hidden">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}

