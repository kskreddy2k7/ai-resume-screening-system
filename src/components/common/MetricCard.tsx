import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  note: string
  icon: LucideIcon
}

export const MetricCard = ({ label, value, note, icon: Icon }: MetricCardProps) => (
  <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">{label}</p>
      <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
        <Icon className="h-4 w-4" />
      </span>
    </div>
    <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500">{note}</p>
  </article>
)
