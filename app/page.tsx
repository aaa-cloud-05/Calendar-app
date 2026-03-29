'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowRight, History, Link2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { readRecentInvitations, RecentInvitation } from './utils/recentInvitations'
import { Skeleton } from '@/components/ui/skeleton'

const Page = () => {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [recentInvitations, setRecentInvitations] = useState<RecentInvitation[] | null>(null)

  const isValidInvitationToken = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

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
    if (!isValidInvitationToken(trimmedToken)) {
      setTokenError('token形式が正しくありません')
      return
    }

    setTokenError('')

    router.push(`/invitation/${encodeURIComponent(trimmedToken)}`)
  }

  return (
    <div className="min-h-screen bg-liner-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-5 py-10 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            シンプルだけど、高機能。
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-zinc-600 leading-relaxed">
            最小限の情報でイベントを作成し、リンク共有で回答を集められます。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Card className="border-zinc-200/80 bg-white/90 backdrop-blur-sm p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
              <Link2 className="size-4 text-zinc-500" />
              招待リンクへ移動
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="invitation-token"
                type="text"
                value={token}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setToken(nextValue)
                  if (!nextValue.trim() || isValidInvitationToken(nextValue.trim())) {
                    setTokenError('')
                  }
                }}
                placeholder="招待ID（token）を入力"
                className={`h-10 ${tokenError ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              <Button type="submit" disabled={!token.trim()} className="h-10 px-5">
                開く
                <ArrowRight className="size-4" />
              </Button>
            </form>
            {tokenError && (
              <p className="text-xs text-red-500">{tokenError}</p>
            )}
          </Card>

          <Button asChild className="h-11 px-6 rounded-xl">
            <Link href="/create" className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              日程調整を作成
            </Link>
          </Button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="size-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-700">過去に閲覧した招待</h2>
          </div>

          {recentInvitations === null ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="border-zinc-200/80 p-4 shadow-sm">
                  <Skeleton className="h-4 w-2/3 bg-zinc-200" />
                  <Skeleton className="mt-2 h-3 w-full bg-zinc-100" />
                </Card>
              ))}
            </div>
          ) : recentInvitations.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentInvitations.map((item) => (
                <Link key={item.token} href={`/invitation/${encodeURIComponent(item.token)}`}>
                  <Card className="h-full border-zinc-200/80 p-4 shadow-sm transition-colors hover:bg-zinc-50">
                    <p className="text-sm font-medium text-zinc-800 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      token: {item.token}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500">
              まだ閲覧履歴はありません。招待リンクを開くとここに表示されます。
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}

export default Page
