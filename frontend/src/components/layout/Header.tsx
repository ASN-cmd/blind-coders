'use client'

import { Bell, Search, Shield, ChevronRight } from 'lucide-react'
import { Policy } from '@/components/features/analysis/PolicyDetailsModal'

interface HeaderProps {
    onSelectPolicy: (policy: Policy | null) => void
}

export function Header({ onSelectPolicy }: HeaderProps) {
    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0B0B15]/60 backdrop-blur-xl sticky top-0 z-40 relative shadow-sm">

            {/* Context Links */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 hover:border-[#F29F67]/30 transition-colors group cursor-pointer">
                    <Shield className="w-4 h-4 text-[#F29F67] group-hover:text-[#F29F67] transition-colors" />
                    <span className="font-medium bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:to-white transition-all">Security Operations</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-white tracking-tight">Policy Analysis</span>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-4">

                <PolicySelector onSelect={onSelectPolicy} />

                <div className="w-px h-6 bg-slate-800 mx-2" />

                <button className="relative p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all group" suppressHydrationWarning>
                    <Bell className="w-5 h-5 group-hover:text-[#F29F67] transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-[#1E1E2C] shadow-lg shadow-[#ef4444]/20 animate-pulse" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F29F67] to-[#3B8FF3] flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-lg shadow-[#F29F67]/20 hover:shadow-[#F29F67]/40 hover:scale-105 transition-all ring-2 ring-white/10">
                    JD
                </div>

            </div>

        </header>
    )
}

function PolicySelector({ onSelect }: { onSelect: (p: Policy | null) => void }) {

    // Using hardcoded policies for now, could be fetched or passed efficiently
    const policies: Policy[] = [
        {
            id: 'AC-1',
            name: 'Access Control Policy and Procedures',
            definition: 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems) and to the types of transactions and functions that authorized users are permitted to exercise.',
            type: 'Technical',
            priority: 'High',
            family: 'Access Control (AC)'
        },
        {
            id: 'IA-2',
            name: 'Identification & Authentication',
            definition: 'Identify information system users, processes acting on behalf of users, or devices and authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.',
            type: 'Technical',
            priority: 'Critical',
            family: 'Identification & Auth (IA)'
        },
        {
            id: 'IR-4',
            name: 'Incident Handling',
            definition: 'Establish an operational incident handling capability for organizational information systems that includes adequate preparation, detection, analysis, containment, recovery, and user response activities.',
            type: 'Operational',
            priority: 'High',
            family: 'Incident Response (IR)'
        },
        {
            id: 'RA-3',
            name: 'Risk Assessment',
            definition: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational information systems and the associated processing, storage, or transmission of organizational information.',
            type: 'Management',
            priority: 'Medium',
            family: 'Risk Assessment (RA)'
        },
    ]

    const handleSelect = (e: any) => {
        const selectedId = e.target.value;
        console.log("Policy Selected:", selectedId);
        const p = policies.find(x => x.id === selectedId) || null
        if (p) {
            console.log("Found Policy:", p);
            onSelect(p);
        } else {
            console.warn("Policy not found for ID:", selectedId);
            onSelect(null);
        }
    };

    return (
        <div className="relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#F29F67]">
                <Search className="h-4 w-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
            </div>
            <select
                onChange={handleSelect}
                value="" // Controlled component: always show placeholder state
                className="bg-[#252536]/50 border border-slate-700/50 text-slate-300 text-sm rounded-xl focus:ring-2 focus:ring-[#F29F67]/50 focus:border-[#F29F67]/50 block w-72 pl-10 p-2.5 appearance-none cursor-pointer hover:bg-[#252536] hover:border-slate-600 transition-all shadow-sm outline-none"
            >
                <option value="" disabled>Search Security Controls...</option>
                {policies.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-50">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>
    )
}
