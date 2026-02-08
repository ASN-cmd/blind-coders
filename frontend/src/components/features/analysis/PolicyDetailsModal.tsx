'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Activity, X, CheckCircle, Lock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Policy {
    id: string
    name: string
    definition: string
    type: string
    priority: string
    family: string
}

interface PolicyDetailsModalProps {
    policy: Policy | null
    onClose: () => void
}

export function PolicyDetailsModal({ policy, onClose }: PolicyDetailsModalProps) {

    // Helper function to determine styles based on policy type
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Technical': return { color: 'text-[#3B8FF3]', bg: 'bg-[#3B8FF3]/10', border: 'border-[#3B8FF3]/20', shadow: 'shadow-[#3B8FF3]/10' }
            case 'Operational': return { color: 'text-[#34B1AA]', bg: 'bg-[#34B1AA]/10', border: 'border-[#34B1AA]/20', shadow: 'shadow-[#34B1AA]/10' }
            case 'Management': return { color: 'text-[#E0B50F]', bg: 'bg-[#E0B50F]/10', border: 'border-[#E0B50F]/20', shadow: 'shadow-[#E0B50F]/10' }
            default: return { color: 'text-[#F29F67]', bg: 'bg-[#F29F67]/10', border: 'border-[#F29F67]/20', shadow: 'shadow-[#F29F67]/10' }
        }
    }

    // Determine styles if policy exists
    const typeStyles = policy ? getTypeStyles(policy.type) : null

    return (
        <AnimatePresence>
            {policy && typeStyles && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-2xl p-[1px] shadow-2xl shadow-black/50 z-10"
                    >
                        {/* Gradient Border Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F29F67]/40 via-[#3B8FF3]/10 to-transparent"></div>

                        {/* Main Content Container */}
                        <div className="relative bg-[#1E1E2C] rounded-2xl overflow-hidden h-full flex flex-col border border-white/5">

                            {/* Header */}
                            <div className="relative p-6 px-8 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-5">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-all shrink-0",
                                            typeStyles.bg,
                                            typeStyles.border,
                                            typeStyles.shadow
                                        )}>
                                            <Shield className={cn("w-7 h-7", typeStyles.color)} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={cn(
                                                    "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold",
                                                    typeStyles.border,
                                                    typeStyles.bg,
                                                    typeStyles.color
                                                )}>
                                                    {policy.type}
                                                </span>
                                                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#ef4444]/20 bg-[#ef4444]/10 text-[#ef4444] font-semibold flex items-center gap-1">
                                                    <Activity className="w-3 h-3" /> {policy.priority} Priority
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                                                {policy.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <span className="font-mono text-xs opacity-70 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">ID: {policy.id}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                <span className="font-mono text-xs opacity-70">NIST SP 800-53 REV. 5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-6">

                                {/* Control Definition */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                                        <FileText className="w-4 h-4 text-[#F29F67]" />
                                        <h3>Control Definition</h3>
                                    </div>
                                    <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 leading-relaxed text-slate-300 text-sm shadow-inner relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#F29F67]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="relative z-10">{policy.definition}</p>
                                    </div>
                                </div>

                                {/* Control Status Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-start gap-3 group hover:border-[#F29F67]/20 transition-colors">
                                        <div className="p-2 rounded-lg bg-[#34B1AA]/10 text-[#34B1AA] border border-[#34B1AA]/20">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Status</span>
                                            <span className="text-slate-200 font-medium text-sm">Fully Implemented</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-start gap-3 group hover:border-[#F29F67]/20 transition-colors">
                                        <div className="p-2 rounded-lg bg-[#3B8FF3]/10 text-[#3B8FF3] border border-[#3B8FF3]/20">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Family</span>
                                            <span className="text-slate-200 font-medium text-sm">{policy.family}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-slate-900/50 border-t border-white/5 flex justify-between items-center backdrop-blur-md">
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-[#34B1AA] animate-pulse" />
                                    System Active
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2 bg-[#F29F67] hover:bg-[#F29F67]/80 text-white text-sm font-medium rounded-lg shadow-lg shadow-[#F29F67]/20 transition-all hover:scale-105 active:scale-95 border border-[#F29F67]/20"
                                    >
                                        View Full Implementation
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
