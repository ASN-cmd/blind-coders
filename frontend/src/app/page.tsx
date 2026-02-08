'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { UploadZone } from '@/features/upload/UploadZone'
import { AnalysisView } from '@/features/analysis/AnalysisView'
import { ShieldCheck, Lock, Activity, BarChart3, AlertOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RmfCycleChart, TaxonomyChart } from '@/components/StandardsCharts'


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
                className="w-full space-y-12"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    Security Control Center
                  </h1>
                  <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    Centralized policy analysis and governance platform aligned with NIST SP 800-53 security controls.
                  </p>
                </div>

                {/* Security Posture Charts */}
                {/* Standards Reference Models */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                  <div className="h-full">
                    <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-full flex flex-col items-center justify-center">
                      <RmfCycleChart />
                    </div>
                  </div>
                  <div className="h-full">
                    <TaxonomyChart />
                  </div>
                </div>

                {/* Policy Analysis Workflow & Upload */}
                <div className="border-y border-[#1e293b] py-12 space-y-8">
                  <div className="flex flex-col xl:flex-row gap-12 justify-between">
                    <div className="space-y-6 max-w-lg shrink-0">
                      <h2 className="text-xl font-semibold text-white">Policy Analysis Workflow</h2>
                      <div className="space-y-4">
                        <WorkflowStep number="1" text="Import organizational policy documents" />
                        <WorkflowStep number="2" text="Map policy content to NIST SP 800-53 controls" />
                        <WorkflowStep number="3" text="Identify missing or weak control coverage" />
                        <WorkflowStep number="4" text="Generate policy gap analysis report" />
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <UploadZone onSuccess={(data) => {
                        setReport(data)
                        setActiveTab('scan')
                      }} />
                    </div>
                  </div>
                </div>

                {/* Static Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoCard
                    icon={ShieldCheck}
                    title="Policy Coverage Scope"
                    content="Covers organizational security policies mapped to NIST SP 800-53 control families including Access Control (AC), Identification and Authentication (IA), Incident Response (IR), Configuration Management (CM), and Risk Assessment (RA)."
                  />
                  <InfoCard
                    icon={Activity}
                    title="Compliance Reference Framework"
                    content="Policy compliance evaluation is performed using control definitions and guidance from NIST Special Publication 800-53."
                  />
                  <InfoCard
                    icon={AlertOctagon}
                    title="Risk Identification Method"
                    content="Security risks are identified by detecting missing, incomplete, or inconsistent policy statements relative to required NIST SP 800-53 controls."
                  />
                </div>

                {/* Supported Security Domains */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Supported Security Domains</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DomainCard title="Information Security Management System (ISMS)" subtitle="Governance, policy structure, and organizational roles." />
                    <DomainCard title="Data Privacy and Security" subtitle="Data protection, encryption, and privacy controls." />
                    <DomainCard title="Patch and Vulnerability Management" subtitle="System integrity, flaw remediation, and updates." />
                    <DomainCard title="Risk Management" subtitle="Risk assessment, response strategies, and monitoring." />
                  </div>
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

function InfoCard({ icon: Icon, title, content }: any) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl hover:bg-[#1e293b]/80 transition-colors group cursor-default h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-[#0f172a] text-blue-500">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-white font-medium text-lg mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {content}
      </p>
    </div>
  )
}

function DomainCard({ title, subtitle }: any) {
  return (
    <div className="bg-[#1e293b]/50 border border-[#334155] p-4 rounded-lg flex items-center gap-4">
      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
      <div>
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}

function WorkflowStep({ number, text }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-[#334155] flex items-center justify-center text-blue-500 font-bold text-sm shrink-0">
        {number}
      </div>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  )
}
