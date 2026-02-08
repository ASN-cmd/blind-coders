'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ComplianceChart() {
    const percentage = 85
    const circumference = 2 * Math.PI * 40 // radius 40

    return (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide mb-6 absolute top-6 left-6">Audit Readiness</h3>

            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-700/30"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        cx="96"
                        cy="96"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className="text-emerald-500"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{percentage}%</span>
                    <span className="text-xs text-emerald-500 font-medium">Ready</span>
                </div>
            </div>

            <div className="mt-2 text-center">
                <p className="text-slate-400 text-sm">Passing 24/28 Controls</p>
            </div>
        </div>
    )
}

export function RiskBarChart() {
    const data = [
        { label: 'Access Control (AC)', value: 92, color: 'bg-blue-500' },
        { label: 'Incident Response (IR)', value: 65, color: 'bg-amber-500' },
        { label: 'Sys & Comm (SC)', value: 78, color: 'bg-purple-500' },
        { label: 'Identification (IA)', value: 88, color: 'bg-emerald-500' },
    ]

    return (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-full flex flex-col">
            <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide mb-6">Control Family Maturity</h3>

            <div className="space-y-5 flex-1 justify-center flex flex-col">
                {data.map((item, index) => (
                    <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300 font-medium">{item.label}</span>
                            <span className="text-slate-400">{item.value}%</span>
                        </div>
                        <div className="h-2.5 bg-[#0f172a] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                                className={cn("h-full rounded-full", item.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
