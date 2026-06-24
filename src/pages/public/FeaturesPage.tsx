import { featureGroups } from '@/pages/public/content'

export const FeaturesPage = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-semibold text-slate-900">Features</h1>
    <p className="mt-2 text-slate-600">Everything inside one modern resume platform.</p>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {featureGroups.map((group) => (
        <article key={group.title} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h2 className="text-lg font-medium text-slate-900">{group.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {group.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
)
