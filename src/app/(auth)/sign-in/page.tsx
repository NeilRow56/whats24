import SignInForm from '@/components/auth/forms/SignInForm'

const SignInPage = () => {
  return (
    <main className="flex min-h-screen w-full flex-col justify-center bg-slate-900 py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SignInForm />
      </div>
    </main>
  )
}

export default SignInPage
