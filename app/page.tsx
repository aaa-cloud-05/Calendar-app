'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [token, setToken] = useState('')

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
    </div>
  )
}

export default Page