import { templateCatalog } from '@/lib/defaults'

export const TemplatesPage = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-semibold text-slate-900">Templates</h1>
    <p className="mt-2 text-slate-600">Professional-ready layouts for every role.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templateCatalog.map((template) => (
        <article key={template} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <h2 className="text-sm font-medium text-slate-900">{template}</h2>
          <div className="mt-3 aspect-[3/4] rounded-lg border border-dashed border-orange-200 bg-orange-50/40" />
        </article>
      ))}
    </div>
  </section>
)
