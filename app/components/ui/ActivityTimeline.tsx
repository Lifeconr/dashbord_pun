import React from "react";

export interface ActivityItem {
    id: string | number;
    title: string;
    description: string;
    timestamp: string;
    type?: "login" | "update" | "delete" | "create" | "other";
}

interface ActivityTimelineProps {
    activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    const getIcon = (type?: string) => {
        switch (type) {
            case 'login': return '🔑';
            case 'update': return '✏️';
            case 'delete': return '🗑️';
            case 'create': return '✨';
            default: return '📌';
        }
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="py-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest border border-dashed border-slate-200 rounded-xl">
                No recent activity
            </div>
        );
    }

    return (
        <div className="relative border-l border-slate-200 ml-3 space-y-6">
            {activities.map((activity) => (
                <div key={activity.id} className="relative pl-6">
                    <span className="absolute -left-3.5 top-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                        {getIcon(activity.type)}
                    </span>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start gap-4 mb-1">
                            <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                            <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
                                {activity.timestamp}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{activity.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
