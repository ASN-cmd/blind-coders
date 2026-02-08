'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface UploadProps {
    onSuccess: (data: any) => void
}

export function UploadZone({ onSuccess }: UploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(p => [...p.slice(-4), msg])

    const handleFile = (f: File) => {
        if (f.type !== 'application/pdf') {
            setStatus('error')
            addLog('Error: Invalid file format (PDF required)')
            return
        }
        setFile(f)
        upload(f)
    }

    const upload = async (f: File) => {
        setStatus('uploading')
        addLog(`Initiating upload: ${f.name}`)

        const formData = new FormData()
        formData.append('file', f)

        try {
            const res = await axios.post('http://localhost:5000/api/upload-pdf?format=json', formData, {
                onUploadProgress: (p) => {
                    const pct = Math.round((p.loaded * 100) / (p.total || 1))
                    setProgress(pct < 90 ? pct : 90)
                }
            })

            setStatus('processing')
            addLog('Upload successful. Starting AI analysis...')

            setTimeout(() => addLog('Parsing PDF structure...'), 800)
            setTimeout(() => addLog('Querying NIST database...'), 1600)

            setTimeout(() => {
                setStatus('success')
                setProgress(100)
                addLog('Analysis complete.')
                setTimeout(() => onSuccess(res.data), 1200)
            }, 3500)

        } catch (err: any) {
            setStatus('error')
            addLog(`Failed: ${err.message}`)
        }
    }

    return (
        <div className="w-full bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white">Import Policy Document</h3>
                    <Badge label="NIST SP 800-53" variant="primary" />
                </div>
                <p className="text-sm text-slate-400">
                    Upload organizational policy documents for automated analysis against NIST SP 800-53 control requirements.
                </p>
            </div>

            <div className="p-8">
                <label
                    className={cn(
                        "relative border-2 border-dashed rounded-lg p-16 transition-all flex flex-col items-center justify-center cursor-pointer group hover:bg-[#1e293b]/50",
                        status === 'idle' ? "border-[#334155] hover:border-blue-500 hover:bg-blue-900/5" : "border-transparent bg-[#0f172a]",
                        status === 'error' && "border-rose-500/50 bg-rose-900/10"
                    )}
                >
                    <input
                        type="file"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={status !== 'idle' && status !== 'error'}
                    />

                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto text-blue-500 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">Click to upload or drag and drop</p>
                                    <p className="text-slate-400 text-sm mt-1">PDF documents only (max 10MB)</p>
                                </div>
                            </motion.div>
                        )}

                        {(status === 'uploading' || status === 'processing') && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full max-w-lg space-y-6 text-center"
                            >
                                <div className="flex items-center justify-center gap-3 text-blue-400 font-medium">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{status === 'uploading' ? 'Uploading...' : 'Analyzing Policy Content'}</span>
                                </div>

                                <div className="w-full bg-[#334155] h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="text-xs text-slate-500 font-mono bg-[#0f172a] py-2 px-4 rounded border border-[#334155]">
                                    {logs[logs.length - 1]}
                                </div>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                                <p className="text-slate-400 text-sm mt-2">Redirecting to results dashboard...</p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500 mb-4">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white text-rose-500">Upload Failed</h3>
                                <p className="text-rose-400/80 text-sm mt-2 max-w-xs mx-auto">
                                    {logs[logs.length - 1]}
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-sm font-medium rounded transition-colors"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>
            </div>

        </div>
    )
}
