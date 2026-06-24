import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/common/PageHeader'

interface SettingsValues {
  autosave: boolean
  compactMode: boolean
  emailAlerts: boolean
}

export const SettingsPage = () => {
  const { register, handleSubmit } = useForm<SettingsValues>({ defaultValues: { autosave: true, compactMode: false, emailAlerts: true } })

  return (
    <section>
      <PageHeader title="Settings" description="Control editor and platform behavior." />
      <form onSubmit={handleSubmit(() => undefined)} className="max-w-xl space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" {...register('autosave')} /> Enable autosave</label>
        <label className="flex items-center gap-2"><input type="checkbox" {...register('compactMode')} /> Compact editor mode</label>
        <label className="flex items-center gap-2"><input type="checkbox" {...register('emailAlerts')} /> Email quality alerts</label>
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white">Save Settings</button>
      </form>
    </section>
  )
}
