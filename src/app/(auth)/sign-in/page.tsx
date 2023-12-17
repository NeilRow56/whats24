import SignInForm from '@/components/auth/forms/SignInForm'

const SignInPage = () => {
  return (
    <main className="flex  w-full flex-col py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SignInForm />
      </div>
    </main>
  )
}

export default SignInPage
