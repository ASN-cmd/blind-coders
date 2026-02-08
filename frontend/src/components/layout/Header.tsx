'use client'

import { Bell, Search, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#1e293b] bg-[#0f172a]/95 backdrop-blur-sm sticky top-0 z-40">

            {/* Context Links */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-medium hover:text-white transition-colors cursor-pointer">Security Operations</span>
                <span className="text-slate-600">/</span>
                <span className="font-semibold text-white">Policy Analysis</span>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-4">

                <div className="relative group hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search policies..."
                        suppressHydrationWarning
                        className="bg-[#1e293b] border border-[#334155] rounded-full px-4 pl-10 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 transition-all hover:bg-[#2d3a4f]"
                    />
                </div>

                <div className="w-px h-6 bg-[#1e293b] mx-2" />

                <button className="relative p-2 rounded-full hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors group" suppressHydrationWarning>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0f172a]" />
                </button>

                <button className="relative p-2 rounded-full hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors" suppressHydrationWarning>
                    <Info className="w-5 h-5" />
                </button>

            </div>

        </header>
    )
}
