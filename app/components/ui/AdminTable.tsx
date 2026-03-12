"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface Column<T> {
    header: string;
    accessor: keyof T | string | ((item: T) => React.ReactNode);
    className?: string;
}

export interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    searchable?: boolean;
    itemsPerPage?: number;
    emptyMessage?: string;
    filtersSlot?: React.ReactNode;
}

export default function AdminTable<T>({ 
    data, 
    columns, 
    keyExtractor,
    searchPlaceholder = "Search...",
    onSearch,
    searchable = true,
    itemsPerPage = 10,
    emptyMessage = "No data found.",
    filtersSlot
}: AdminTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) onSearch(query);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    {searchable && (
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-200/30 focus:border-primary transition-all outline-none placeholder:text-slate-400"
                            />
                        </div>
                    )}
                    {filtersSlot}
                </div>
                <div className="flex gap-2">
                    {/* Potential Action Buttons slot could go here */}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-slate-200">
                            {columns.map((col, i) => (
                                <th key={i} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <tr key={keyExtractor(item)} className="hover:bg-slate-50/50 transition-colors group">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={`px-6 py-4 text-sm font-bold text-slate-900 ${col.className || ''}`}>
                                            {typeof col.accessor === 'function' 
                                                ? col.accessor(item) 
                                                : (item[col.accessor as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-16 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center translate-y-2">
                                            <Inbox className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-black text-slate-900">{emptyMessage}</p>
                                            <p className="text-xs font-medium text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex gap-1 hidden sm:flex">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                                        currentPage === page 
                                            ? 'bg-primary text-white shadow-md shadow-primary-200/20' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

