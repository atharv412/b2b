"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Feed } from "@/components/posts"
import { PostComposer } from "@/components/posts"

function FeedPageContent() {
  const searchParams = useSearchParams()
  const [showComposer, setShowComposer] = useState(false)

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'create') {
      setShowComposer(true)
    }
  }, [searchParams])

  const handlePostCreated = () => {
    setShowComposer(false)
    // Optionally refresh the feed or navigate back
  }

  return (
    <PlatformLayout>
      <Feed />
      {showComposer && (
        <PostComposer
          trigger={null}
          onPostCreated={handlePostCreated}
          variant="modal"
        />
      )}
    </PlatformLayout>
  )
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedPageContent />
    </Suspense>
  )
}
