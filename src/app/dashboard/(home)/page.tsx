import { PostsSkeleton } from '@/components/Skeletons'
import PostsPage from '@/components/posts/Posts'
import { Suspense } from 'react'

function DashboardPage() {
  return (
    <main className="flex w-full grow">
      <div className="mx-auto flex max-w-lg flex-1 flex-col gap-y-8 pb-20">
        <Suspense

        // fallback={<PostsSkeleton />}
        >
          <PostsPage />
        </Suspense>
      </div>
    </main>
  )
}

export default DashboardPage
