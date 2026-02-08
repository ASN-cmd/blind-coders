'use client'

import { Bell, Search, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function Header() {
    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#1e293b] bg-[#0f172a]/95 backdrop-blur-sm sticky top-0 z-40 relative">

            {/* Context Links */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-medium hover:text-white transition-colors cursor-pointer">Security Operations</span>
                <span className="text-slate-600">/</span>
                <span className="font-semibold text-white">Policy Analysis</span>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-4">

                <PolicySelector />

                <div className="w-px h-6 bg-[#1e293b] mx-2" />

                <button className="relative p-2 rounded-full hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors group" suppressHydrationWarning>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0f172a]" />
                </button>

                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                    JD
                </div>

            </div>

        </header>
    )
}

function PolicySelector() {
    const [selected, setSelected] = useState<string | null>(null)

    const policies = [
        {
            id: 'AC',
            name: 'Access Control (AC)',
            definition: 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems) and to the types of transactions and functions that authorized users are permitted to exercise.'
        },
        {
            id: 'IA',
            name: 'Identification & Auth (IA)',
            definition: 'Identify information system users, processes acting on behalf of users, or devices and authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.'
        },
        {
            id: 'IR',
            name: 'Incident Response (IR)',
            definition: 'Establish an operational incident handling capability for organizational information systems that includes adequate preparation, detection, analysis, containment, recovery, and user response activities.'
        },
        {
            id: 'RA',
            name: 'Risk Assessment (RA)',
            definition: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational information systems and the associated processing, storage, or transmission of organizational information.'
        },
    ]

    return (
        <>
            <div className="relative group hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                </div>
                <select
                    onChange={(e) => setSelected(e.target.value)}
                    value={selected || ""}
                    className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-64 pl-10 p-2 appearance-none cursor-pointer hover:bg-[#2d3a4f] transition-colors"
                >
                    <option value="" disabled>Select Policy Family...</option>
                    {policies.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                                            <Info className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {policies.find(p => p.id === selected)?.name}
                                            </h3>
                                            <span className="text-xs text-slate-400 font-mono">NIST SP 800-53 Rev. 5</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Control Definition</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {policies.find(p => p.id === selected)?.definition}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Close Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
