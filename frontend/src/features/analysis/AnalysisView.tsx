'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ShieldCheck,
    ShieldAlert,
    Search,
    Filter,
    Download,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export function AnalysisView({ data, onReset }: any) {
    const domains = Object.keys(data.gap_analysis || {})
    const allSubdomains = domains.flatMap(d => {
        const s = data.gap_analysis[d].subdomains_analysis || [data.gap_analysis[d]]
        return s.map((sub: any) => ({ ...sub, domain: d }))
    })

    const totalGaps = allSubdomains.reduce((acc, s) => acc + (s.gap_analysis?.length || 0), 0)
    const score = Math.max(0, 100 - (totalGaps * 2.5)).toFixed(1)

    return (
        <div className="space-y-8 animate-enter">

            {/* Overview Stats */}
            <h2 className="text-2xl font-bold mb-6">Security Posture Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Compliance Score" value={`${score}%`} color={Number(score) > 80 ? "text-emerald-500" : "text-rose-500"} icon={ShieldCheck} />
                <StatsCard title="Critical Gaps" value={totalGaps} color="text-rose-500" icon={AlertTriangle} />
                <StatsCard title="Domains Passing" value={domains.length - 2} color="text-blue-500" icon={CheckCircle} />
                <StatsCard title="Policy Coverage" value="100%" color="text-purple-500" icon={Search} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">

                {/* Domain List (Sidebar) */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">Analyzed Domains</h3>
                        <Badge label={`${domains.length} Active`} variant="primary" />
                    </div>

                    <div className="space-y-3">
                        {domains.map((domain) => (
                            <DomainCard key={domain} domain={domain} data={data.gap_analysis[domain]} />
                        ))}
                    </div>
                </div>

                {/* Detailed Findings (Main) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">Detailed Findings</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded hover:text-white text-slate-400 text-xs font-medium transition-colors">
                                <Filter className="w-3 h-3" /> Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded hover:text-white text-slate-400 text-xs font-medium transition-colors">
                                <Download className="w-3 h-3" /> Export Report
                            </button>
                        </div>
                    </div>

                    {allSubdomains.map((sub: any, i: number) => (
                        <DetailRow key={i} data={sub} />
                    ))}
                </div>

            </div>

            <div className="mt-12 text-center pt-8 border-t border-[#1e293b]">
                <button
                    onClick={onReset}
                    className="text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium flex items-center justify-center mx-auto gap-2"
                >
                    <AlertCircle className="w-4 h-4" /> Reset Analysis
                </button>
            </div>

        </div>
    )
}

function StatsCard({ title, value, color, icon: Icon }: any) {
    return (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
                <div className={cn("p-2 rounded-lg bg-[#0f172a]", color)}><Icon className="w-5 h-5" /></div>
            </div>
            <div className={cn("text-3xl font-bold tracking-tight", color)}>{value}</div>
        </div>
    )
}

function DomainCard({ domain, data }: any) {
    const sub = data.subdomains_analysis || [data]
    const gaps = sub.reduce((acc: number, s: any) => acc + (s.gap_analysis?.length || 0), 0)
    const hasIssues = gaps > 0

    return (
        <div className={cn(
            "p-4 border rounded-lg transition-all hover:bg-[#1e293b]/50 cursor-pointer group",
            hasIssues ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30"
        )}>
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white">{domain}</h4>
                {hasIssues ? (
                    <Badge label={`${gaps} Gaps`} variant="danger" />
                ) : (
                    <Badge label="Secure" variant="success" />
                )}
            </div>
            <div className="text-xs text-slate-500 font-medium">
                {sub.length} Sub-controls evaluated
            </div>
        </div>
    )
}

function DetailRow({ data }: { data: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const gaps = data.gap_analysis || []
    const hasIssues = gaps.length > 0

    return (
        <div className="border border-[#334155] bg-[#1e293b] rounded-lg overflow-hidden transition-all hover:border-blue-500/30">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#334155]/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-[#1e293b]", hasIssues ? "bg-rose-500 ring-rose-500/30" : "bg-emerald-500 ring-emerald-500/30")} />
                    <div>
                        <h3 className="font-semibold text-base text-slate-200">{data.subdomain}</h3>
                        <p className="text-xs text-slate-500">NIST SP 800-53 Control Set</p>
                    </div>
                </div>

                <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#0f172a]/50 border-t border-[#334155]"
                    >
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {hasIssues ? (
                                <div className="space-y-4">
                                    {gaps.map((gap: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 rounded bg-rose-500/5 border border-rose-500/10">
                                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-rose-400 bg-rose-900/20 px-1.5 py-0.5 rounded uppercase">{gap.severity}</span>
                                                    <span className="text-xs font-mono text-slate-500">{gap.gap_id}</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed">{gap.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-500/5 text-emerald-400 text-sm font-medium flex items-center gap-2 rounded border border-emerald-500/10">
                                    <CheckCircle className="w-4 h-4" /> All controls validated successfully.
                                </div>
                            )}

                            {data.revised_policy?.statements && (
                                <div className="mt-4 pt-4 border-t border-[#334155]">
                                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Recommended Policy Revisions</h4>
                                    <div className="bg-[#0f172a] p-4 rounded border border-[#334155] font-mono text-sm text-slate-400 space-y-2">
                                        {data.revised_policy.statements.map((stmt: string, i: number) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="text-emerald-500 font-bold">+</span>
                                                <span>{stmt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
