import { PageHeader } from '@/components/common/PageHeader'
import { templateCatalog } from '@/lib/defaults'
import { usePlatformStore } from '@/store/usePlatformStore'

export const AppTemplatesPage = () => {
  const { updateTemplate } = usePlatformStore()

  return (
    <section>
      <PageHeader title="Templates" description="Apply a resume template and preview style instantly." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {templateCatalog.map((template) => (
          <button key={template} onClick={() => updateTemplate(template)} className="rounded-xl border border-[#E2E8F0] bg-white p-4 text-left hover:border-orange-300">
            <h2 className="text-sm font-medium text-slate-900">{template}</h2>
            <div className="mt-3 aspect-[3/4] rounded-lg border border-dashed border-orange-200 bg-orange-50/30" />
          </button>
        ))}
      </div>
    </section>
  )
}
