import { cn } from '@/lib/utils'

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
    className?: string;
    icon?: any;
}

export function Badge({ label, variant = 'default', className, icon: Icon }: BadgeProps) {
    const styles = {
        primary: 'text-[#3B8FF3] bg-[#3B8FF3]/10 border-[#3B8FF3]/20',
        success: 'text-[#34B1AA] bg-[#34B1AA]/10 border-[#34B1AA]/20',
        warning: 'text-[#E0B50F] bg-[#E0B50F]/10 border-[#E0B50F]/20',
        danger: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20',
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
