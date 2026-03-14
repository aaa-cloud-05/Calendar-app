'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { readRecentInvitations, RecentInvitation } from './utils/recentInvitations'

const Page = () => {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [recentInvitations, setRecentInvitations] = useState<RecentInvitation[] | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecentInvitations(readRecentInvitations())
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedToken = token.trim()
    if (!trimmedToken) return

    router.push(`/invitation/${encodeURIComponent(trimmedToken)}`)
  }

  return (
    <div>
      <h1>LP</h1>
      <Link href="/create">Create Button (CTA)</Link>

      <form onSubmit={handleSubmit}>
        <label htmlFor="invitation-token">Invitation ID (token)</label>
        <input
          id="invitation-token"
          type="text"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="tokenを入力"
        />
        <button type="submit" disabled={!token.trim()}>
          GO
        </button>
      </form>
      
      {recentInvitations && recentInvitations.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">最近の閲覧</h2>
          <div className="space-y-2">
            {recentInvitations.map((item) => (
              <Link key={item.token} href={`/invitation/${encodeURIComponent(item.token)}`}>
                <Card className="p-3 text-sm">{item.title}</Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Page