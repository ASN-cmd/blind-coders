'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { UploadZone } from '@/features/upload/UploadZone'
import { AnalysisView } from '@/features/analysis/AnalysisView'
import { ShieldCheck, Lock, Activity, BarChart3, AlertOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'


export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [report, setReport] = useState<any>(null)

  const stats = {
    policies: 24,
    compliance: "92%",
    risks: 3
  }

  return (
    <div className="flex h-screen overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">

      {/* 1. Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col relative bg-[#0f172a] overflow-hidden">

        <Header />

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <AnimatePresence mode="wait">

            {/* VIEW: DASHBOARD */}
            {activeTab === 'dashboard' && !report && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    Security Control Center
                  </h1>
                  <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    Centralized policy management and automated compliance verification for NIST SP 800-53 standards.
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DashboardCard icon={ShieldCheck} title="Active Policies" value={stats.policies} delta="+2 this week" color="text-blue-500" />
                  <DashboardCard icon={Activity} title="Compliance Rate" value={stats.compliance} delta="+4.5%" color="text-emerald-500" />
                  <DashboardCard icon={AlertOctagon} title="Open Risks" value={stats.risks} delta="-1 resolved" color="text-rose-500" />
                </div>

                {/* Action Area */}
                <div className="border-t border-[#1e293b] pt-12">
                  <h2 className="text-xl font-semibold text-white mb-6">Initiate New Audit</h2>
                  <UploadZone onSuccess={(data) => {
                    setReport(data)
                    setActiveTab('scan')
                  }} />
                </div>

              </motion.div>
            )}

            {/* VIEW: ANALYSIS */}
            {(activeTab === 'scan' || report) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-[1400px] mx-auto"
              >
                {!report ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                    <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No active analysis session</p>
                    <p className="text-sm">Please upload a policy document to begin</p>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  <AnalysisView data={report} onReset={() => {
                    setReport(null)
                    setActiveTab('dashboard')
                  }} />
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function DashboardCard({ icon: Icon, title, value, delta, color }: any) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl hover:bg-[#1e293b]/80 transition-colors group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-lg bg-[#0f172a]", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded bg-[#0f172a] text-slate-400", delta.includes('+') ? "text-emerald-500" : "text-slate-400")}>
          {delta}
        </span>
      </div>
      <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide mb-1">{title}</h3>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    </div>
  )
}
