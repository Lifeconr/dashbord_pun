"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface PermissionAction {
    id: string; 
    label: string;
}

export interface PermissionFeature {
    name: string; 
    actions: PermissionAction[];
}

export interface PermissionModule {
    name: string; 
    features: PermissionFeature[];
}

interface IndeterminateCheckboxProps {
    checked: boolean;
    indeterminate: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const IndeterminateCheckbox = ({ checked, indeterminate, onChange, label }: IndeterminateCheckboxProps) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
                <input 
                    ref={ref} 
                    type="checkbox" 
                    checked={checked} 
                    onChange={onChange} 
                    className="w-4 h-4 text-primary accent-primary border-slate-300 rounded focus:ring-primary-200 cursor-pointer transition-all peer"
                />
            </div>
            <span className="text-sm font-bold text-slate-700 select-none group-hover:text-slate-900 transition-colors">{label}</span>
        </label>
    );
};

interface PermissionCheckboxGridProps {
    modules: PermissionModule[];
    selectedPermissions: string[];
    onChange: (permissions: string[]) => void;
}

export default function PermissionCheckboxGrid({ modules, selectedPermissions, onChange }: PermissionCheckboxGridProps) {
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        modules.reduce((acc, m) => ({ ...acc, [m.name]: true }), {})
    );

    const toggleModuleExp = (name: string) => {
        setExpandedModules(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleToggle = (ids: string[], isChecking: boolean) => {
        if (isChecking) {
            const newSelections = Array.from(new Set([...selectedPermissions, ...ids]));
            onChange(newSelections);
        } else {
            const newSelections = selectedPermissions.filter(id => !ids.includes(id));
            onChange(newSelections);
        }
    };

    return (
        <div className="bg-white rounded-lg p-2 space-y-2">
            {modules.map(module => {
                const moduleIds = module.features.flatMap(f => f.actions.map(a => a.id));
                const checkedModuleIds = moduleIds.filter(id => selectedPermissions.includes(id));
                const isModuleChecked = checkedModuleIds.length === moduleIds.length && moduleIds.length > 0;
                const isModuleIndeterminate = checkedModuleIds.length > 0 && checkedModuleIds.length < moduleIds.length;
                const isExpanded = expandedModules[module.name];

                return (
                    <div key={module.name} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 border-b border-slate-100 p-3.5 flex items-center justify-between group cursor-pointer hover:bg-slate-100/50 transition-colors">
                            <IndeterminateCheckbox 
                                label={module.name}
                                checked={isModuleChecked}
                                indeterminate={isModuleIndeterminate}
                                onChange={(e) => handleToggle(moduleIds, e.target.checked)}
                            />
                            <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); toggleModuleExp(module.name); }}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="p-5 pl-12 space-y-7 bg-white">
                                {module.features.map(feature => {
                                    const featureIds = feature.actions.map(a => a.id);
                                    const checkedFeatureIds = featureIds.filter(id => selectedPermissions.includes(id));
                                    const isFeatureChecked = checkedFeatureIds.length === featureIds.length && featureIds.length > 0;
                                    const isFeatureIndeterminate = checkedFeatureIds.length > 0 && checkedFeatureIds.length < featureIds.length;

                                    return (
                                        <div key={feature.name} className="space-y-4">
                                            <IndeterminateCheckbox 
                                                label={feature.name}
                                                checked={isFeatureChecked}
                                                indeterminate={isFeatureIndeterminate}
                                                onChange={(e) => handleToggle(featureIds, e.target.checked)}
                                            />
                                            
                                            <div className="pl-6.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                                                {feature.actions.map(action => {
                                                    const isActionChecked = selectedPermissions.includes(action.id);
                                                    return (
                                                        <IndeterminateCheckbox 
                                                            key={action.id}
                                                            label={action.label}
                                                            checked={isActionChecked}
                                                            indeterminate={false}
                                                            onChange={(e) => handleToggle([action.id], e.target.checked)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
