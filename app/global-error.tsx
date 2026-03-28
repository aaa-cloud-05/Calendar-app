"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[global-error]", error)
  }, [error])

  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 px-4 text-zinc-900">
        <h1 className="text-lg font-semibold">問題が発生しました</h1>
        <p className="max-w-md text-center text-sm text-zinc-600">
          しばらくしてからページを再読み込みしてください。改善しない場合は管理者にお問い合わせください。
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          再試行
        </button>
      </body>
    </html>
  )
}
