import { cn } from '@/lib/utils'

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
    className?: string;
    icon?: any;
}

export function Badge({ label, variant = 'default', className, icon: Icon }: BadgeProps) {
    const styles = {
        primary: 'text-blue-400 bg-blue-900/10 border-blue-500/20',
        success: 'text-emerald-400 bg-emerald-900/10 border-emerald-500/20',
        warning: 'text-amber-400 bg-amber-900/10 border-amber-500/20',
        danger: 'text-rose-400 bg-rose-900/10 border-rose-500/20',
        default: 'text-slate-400 bg-slate-800/20 border-slate-700/30'
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider border select-none transition-colors",
            styles[variant],
            className
        )}>
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </span>
    )
}
