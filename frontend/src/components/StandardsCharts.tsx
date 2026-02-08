'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function RmfCycleChart() {
    const steps = [
        { id: 1, label: 'Prepare', color: 'bg-[#34B1AA]' },
        { id: 2, label: 'Categorize', color: 'bg-[#3B8FF3]' },
        { id: 3, label: 'Select', color: 'bg-[#F29F67]' },
        { id: 4, label: 'Implement', color: 'bg-[#E0B50F]' },
        { id: 5, label: 'Assess', color: 'bg-[#F29F67]' },
        { id: 6, label: 'Authorize', color: 'bg-[#ef4444]' },
        { id: 7, label: 'Monitor', color: 'bg-[#34B1AA]' },
    ]

    return (
        <div className="bg-[#151520]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl h-full flex flex-col relative overflow-hidden transition-all hover:border-[#F29F67]/20 hover:shadow-lg group">
            <h3 className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-6">NIST RMF Lifecycle</h3>

            <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
                {/* Connecting Ring */}
                <div className="absolute inset-0 m-auto w-40 h-40 rounded-full border-2 border-dashed border-slate-700/50 animate-[spin_60s_linear_infinite]" />

                <div className="relative w-56 h-56">
                    {steps.map((step, index) => {
                        const angle = (index * (360 / steps.length)) - 90
                        const radius = 85 // distance from center
                        const x = radius * Math.cos((angle * Math.PI) / 180)
                        const y = radius * Math.sin((angle * Math.PI) / 180)

                        return (
                            <motion.div
                                key={step.id}
                                className={cn(
                                    "absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-[#252536] z-10 cursor-default",
                                    step.color
                                )}
                                style={{
                                    left: `calc(50% + ${x}px - 20px)`,
                                    top: `calc(50% + ${y}px - 20px)`,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1, zIndex: 20 }}
                            >
                                <span className="sr-only">{step.label}</span>
                                {step.id}

                                {/* Tooltip */}
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1E1E2C] border border-[#334155] rounded text-[10px] whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none group-hover:opacity-100 z-50">
                                    {step.label}
                                </div>
                            </motion.div>
                        )
                    })}

                    {/* Center Hub */}
                    <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#1E1E2C] border border-[#334155] flex flex-col items-center justify-center z-0 text-center shadow-inner">
                        <span className="text-[#3B8FF3] font-bold text-[10px]">NIST</span>
                        <span className="text-slate-400 text-[8px]">SP 800-37</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {steps.map(s => (
                    <div key={s.id} className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", s.color)} />
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">{s.label}</span>
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
            color: 'bg-[#3B8FF3]',
            families: ['Access Control (AC)', 'Audit & Acc. (AU)', 'Ident. & Auth. (IA)', 'Sys. & Comm. (SC)']
        },
        {
            name: 'Operational',
            color: 'bg-[#34B1AA]',
            families: ['Awareness & Tr. (AT)', 'Config. Mgmt (CM)', 'Incident Resp. (IR)', 'Maintenance (MA)', 'Media Prot. (MP)', 'Phy. Prot. (PE)']
        },
        {
            name: 'Management',
            color: 'bg-[#E0B50F]',
            families: ['Assessment (CA)', 'Planning (PL)', 'Risk Assess. (RA)', 'Sys. & Serv. Acq. (SA)', 'Prog. Mgmt (PM)']
        }
    ]

    return (
        <div className="bg-[#151520]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl h-full flex flex-col transition-all hover:border-[#F29F67]/20 hover:shadow-lg group">
            <h3 className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-6">NIST SP 800-53 Control Taxonomy</h3>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {classes.map((cls, idx) => (
                    <motion.div
                        key={cls.name}
                        className="bg-[#1E1E2C]/40 rounded-lg p-3 border border-[#334155] flex flex-col hover:bg-[#1E1E2C]/60 transition-colors shrink-0"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#334155]">
                            <div className={cn("w-2 h-2 rounded-full", cls.color)} />
                            <span className="text-sm font-semibold text-white">{cls.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {cls.families.map((fam) => (
                                <div key={fam} className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-default px-1.5 py-1 rounded bg-[#252536] border border-white/5 whitespace-nowrap">
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

export function NistDistributionChart() {
    // Illustrative data roughly based on family size/importance
    const data = [
        { label: 'Access Control (AC)', value: 85, color: 'bg-[#3B8FF3]' },
        { label: 'System & Info Integrity (SI)', value: 75, color: 'bg-[#F29F67]' },
        { label: 'Config. Mgmt (CM)', value: 65, color: 'bg-[#E0B50F]' },
        { label: 'Audit & Accountability (AU)', value: 60, color: 'bg-[#34B1AA]' },
        { label: 'Ident. & Auth. (IA)', value: 55, color: 'bg-[#3B8FF3]' },
        { label: 'Risk Assessment (RA)', value: 40, color: 'bg-[#ef4444]' },
        { label: 'Incident Response (IR)', value: 35, color: 'bg-[#E0B50F]' },
    ]

    return (
        <div className="bg-[#151520]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl h-full flex flex-col transition-all hover:border-[#F29F67]/20 hover:shadow-lg group">
            <div className="mb-6">
                <h3 className="text-white font-semibold text-sm mb-1">Control Distribution</h3>
                <p className="text-slate-500 text-xs">Relative size of control families in NIST SP 800-53.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4 overflow-y-auto">
                {data.map((item, idx) => (
                    <div key={item.label} className="group/bar">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-300 font-medium group-hover/bar:text-white transition-colors truncate pr-2">{item.label}</span>
                            <span className="text-slate-500 font-mono shrink-0">{item.value}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1E1E2C] rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                className={cn("h-full rounded-full w-0", item.color)}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#334155] flex items-center justify-between text-[10px] text-slate-500">
                <span>Total Scope</span>
                <span className="font-mono text-[#34B1AA]">High Confidence</span>
            </div>
        </div>
    )
}
