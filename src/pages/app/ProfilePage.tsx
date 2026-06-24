import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/common/PageHeader'

interface ProfileValues {
  fullName: string
  headline: string
  location: string
}

export const ProfilePage = () => {
  const { register, handleSubmit } = useForm<ProfileValues>({
    defaultValues: {
      fullName: 'TalentFlow User',
      headline: 'Software Engineer',
      location: 'Remote',
    },
  })

  return (
    <section>
      <PageHeader title="Profile" description="Manage profile defaults used in your resumes." />
      <form onSubmit={handleSubmit(() => undefined)} className="max-w-xl space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
        <input {...register('fullName')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
        <input {...register('headline')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
        <input {...register('location')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white">Save Profile</button>
      </form>
    </section>
  )
}
