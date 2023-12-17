const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      {children}
    </div>
  )
}

export default AuthLayout
