import React from "react";

interface UserAvatarProps {
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export default function UserAvatar({ name, size = "md", className = "" }: UserAvatarProps) {
    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-2xl",
        xl: "w-24 h-24 text-4xl"
    };

    return (
        <div className={`rounded-full bg-primary text-white font-black flex items-center justify-center shadow-sm select-none ${sizeClasses[size]} ${className}`}>
            {getInitials(name)}
        </div>
    );
}
