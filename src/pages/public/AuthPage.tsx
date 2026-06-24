import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

interface AuthValues {
  email: string
  password: string
  name?: string
}

interface AuthPageProps {
  type: 'login' | 'register'
}

export const AuthPage = ({ type }: AuthPageProps) => {
  const { register, handleSubmit } = useForm<AuthValues>()
  const isRegister = type === 'register'

  const onSubmit = () => {
    window.location.assign('/app')
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-slate-600">Access your TalentFlow workspace.</p>
        <div className="mt-5 space-y-3">
          {isRegister && <input {...register('name')} placeholder="Full name" className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />}
          <input {...register('email', { required: true })} placeholder="Email" className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
          <input {...register('password', { required: true })} placeholder="Password" type="password" className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="mt-5 w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600">
          {isRegister ? 'Register' : 'Login'}
        </button>
        <p className="mt-3 text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={isRegister ? '/login' : '/register'} className="text-orange-600">{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </form>
    </section>
  )
}
