import Header from '@/components/homeLayout/Header'

function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default HomePageLayout
