const plans = [
  { name: 'Starter', price: '$0', bullets: ['1 resume', 'Basic ATS scan', 'PDF export'] },
  { name: 'Pro', price: '$19/mo', bullets: ['Unlimited resumes', 'Advanced analyzer', 'Job matching + templates'] },
  { name: 'Team', price: '$49/mo', bullets: ['Team workspace', 'Shared templates', 'Priority support'] },
]

export const PricingPage = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-semibold text-slate-900">Pricing</h1>
    <p className="mt-2 text-slate-600">Transparent plans for individuals and teams.</p>
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <h2 className="text-xl font-medium text-slate-900">{plan.name}</h2>
          <p className="mt-2 text-3xl font-semibold text-orange-500">{plan.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {plan.bullets.map((bullet) => (
              <li key={bullet}>• {bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
)
