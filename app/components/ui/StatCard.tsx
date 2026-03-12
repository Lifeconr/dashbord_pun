import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
}

export default function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-200/10 flex items-center justify-center border border-primary-200/20">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                {trend && trendValue && (
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 uppercase tracking-widest ${
                        trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 
                        trend === 'down' ? 'text-rose-700 bg-rose-50' : 
                        'text-slate-600 bg-slate-100'
                    }`}>
                        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />} 
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                {description && <p className="text-xs text-slate-500 mt-2 font-medium">{description}</p>}
            </div>
        </div>
    );
}
