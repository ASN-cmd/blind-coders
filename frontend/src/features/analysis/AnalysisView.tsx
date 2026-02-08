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
                <StatsCard title="Compliance Score" value={`${score}%`} color={Number(score) > 80 ? "text-[#34B1AA]" : "text-[#ef4444]"} icon={ShieldCheck} />
                <StatsCard title="Critical Gaps" value={totalGaps} color="text-[#ef4444]" icon={AlertTriangle} />
                <StatsCard title="Domains Passing" value={domains.length - 2} color="text-[#3B8FF3]" icon={CheckCircle} />
                <StatsCard title="Policy Coverage" value="100%" color="text-[#E0B50F]" icon={Search} />
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
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#252536] border border-[#334155] rounded hover:text-white text-slate-400 text-xs font-medium transition-colors">
                                <Filter className="w-3 h-3" /> Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#252536] border border-[#334155] rounded hover:text-white text-slate-400 text-xs font-medium transition-colors">
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
                    className="text-slate-500 hover:text-[#ef4444] transition-colors text-sm font-medium flex items-center justify-center mx-auto gap-2"
                >
                    <AlertCircle className="w-4 h-4" /> Reset Analysis
                </button>
            </div>

        </div>
    )
}

function StatsCard({ title, value, color, icon: Icon }: any) {
    return (
        <div className="bg-[#151520]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:border-[#F29F67]/20 group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
                <div className={cn("p-2 rounded-lg bg-[#1E1E2C]", color)}><Icon className="w-5 h-5" /></div>
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
            "p-4 border rounded-lg transition-all hover:bg-[#151520] cursor-pointer group backdrop-blur-sm",
            hasIssues ? "border-[#ef4444]/20 bg-[#ef4444]/5" : "border-white/5 bg-[#151520]/40 hover:border-[#34B1AA]/30"
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
        <div className="border border-white/5 bg-[#151520]/60 backdrop-blur-md rounded-lg overflow-hidden transition-all hover:border-[#3B8FF3]/30 shadow-sm">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#334155]/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-[#252536]", hasIssues ? "bg-[#ef4444] ring-[#ef4444]/30" : "bg-[#34B1AA] ring-[#34B1AA]/30")} />
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
                        className="bg-[#1E1E2C]/50 border-t border-[#334155]"
                    >
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {hasIssues ? (
                                <div className="space-y-4">
                                    {gaps.map((gap: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 rounded bg-[#ef4444]/5 border border-[#ef4444]/10">
                                            <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-[#ef4444] bg-[#ef4444]/20 px-1.5 py-0.5 rounded uppercase">{gap.severity}</span>
                                                    <span className="text-xs font-mono text-slate-500">{gap.gap_id}</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed">{gap.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-[#34B1AA]/5 text-[#34B1AA] text-sm font-medium flex items-center gap-2 rounded border border-[#34B1AA]/10">
                                    <CheckCircle className="w-4 h-4" /> All controls validated successfully.
                                </div>
                            )}

                            {data.revised_policy?.statements && (
                                <div className="mt-4 pt-4 border-t border-[#334155]">
                                    <h4 className="text-xs font-semibold text-[#3B8FF3] uppercase tracking-wider mb-3">Recommended Policy Revisions</h4>
                                    <div className="bg-[#1E1E2C] p-4 rounded border border-[#334155] font-mono text-sm text-slate-400 space-y-2">
                                        {data.revised_policy.statements.map((stmt: string, i: number) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="text-[#34B1AA] font-bold">+</span>
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
