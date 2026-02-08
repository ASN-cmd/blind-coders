'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function RmfCycleChart() {
    const steps = [
        { id: 1, label: 'Prepare', color: 'bg-slate-500' },
        { id: 2, label: 'Categorize', color: 'bg-blue-500' },
        { id: 3, label: 'Select', color: 'bg-indigo-500' },
        { id: 4, label: 'Implement', color: 'bg-purple-500' },
        { id: 5, label: 'Assess', color: 'bg-pink-500' },
        { id: 6, label: 'Authorize', color: 'bg-rose-500' },
        { id: 7, label: 'Monitor', color: 'bg-emerald-500' },
    ]

    return (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-full flex flex-col relative overflow-hidden">
            <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide mb-6">NIST RMF Lifecycle</h3>

            <div className="flex-1 flex items-center justify-center relative">
                {/* Connecting Ring */}
                <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border-2 border-dashed border-slate-700/50 animate-[spin_60s_linear_infinite]" />

                <div className="relative w-64 h-64">
                    {steps.map((step, index) => {
                        const angle = (index * (360 / steps.length)) - 90
                        const radius = 100 // distance from center
                        const x = radius * Math.cos((angle * Math.PI) / 180)
                        const y = radius * Math.sin((angle * Math.PI) / 180)

                        return (
                            <motion.div
                                key={step.id}
                                className={cn(
                                    "absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-[#1e293b] z-10 cursor-default",
                                    step.color
                                )}
                                style={{
                                    left: `calc(50% + ${x}px - 24px)`,
                                    top: `calc(50% + ${y}px - 24px)`,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1, zIndex: 20 }}
                            >
                                <span className="sr-only">{step.label}</span>
                                {step.id}

                                {/* Tooltip */}
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0f172a] border border-[#334155] rounded text-[10px] whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none group-hover:opacity-100">
                                    {step.label}
                                </div>
                            </motion.div>
                        )
                    })}

                    {/* Center Hub */}
                    <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#0f172a] border border-[#334155] flex flex-col items-center justify-center z-0 text-center">
                        <span className="text-blue-500 font-bold text-xs">NIST</span>
                        <span className="text-slate-400 text-[10px]">SP 800-37</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {steps.map(s => (
                    <div key={s.id} className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", s.color)} />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function TaxonomyChart() {
    const classes = [
        {
            name: 'Technical',
            color: 'bg-blue-500',
            families: ['Access Control (AC)', 'Audit & Acc. (AU)', 'Ident. & Auth. (IA)', 'Sys. & Comm. (SC)']
        },
        {
            name: 'Operational',
            color: 'bg-emerald-500',
            families: ['Awareness & Tr. (AT)', 'Config. Mgmt (CM)', 'Incident Resp. (IR)', 'Maintenance (MA)', 'Media Prot. (MP)', 'Phy. Prot. (PE)']
        },
        {
            name: 'Management',
            color: 'bg-amber-500',
            families: ['Assessment (CA)', 'Planning (PL)', 'Risk Assess. (RA)', 'Sys. & Serv. Acq. (SA)', 'Prog. Mgmt (PM)']
        }
    ]

    return (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-full flex flex-col">
            <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide mb-6">NIST SP 800-53 Control Taxonomy</h3>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map((cls, idx) => (
                    <motion.div
                        key={cls.name}
                        className="bg-[#0f172a]/50 rounded-lg p-3 border border-[#334155] flex flex-col"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#334155]">
                            <div className={cn("w-2 h-2 rounded-full", cls.color)} />
                            <span className="text-sm font-semibold text-white">{cls.name}</span>
                        </div>
                        <div className="space-y-1.5 overflow-y-auto">
                            {cls.families.map((fam) => (
                                <div key={fam} className="text-xs text-slate-400 hover:text-white transition-colors cursor-default px-2 py-1 rounded hover:bg-[#1e293b]">
                                    {fam}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
