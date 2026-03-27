"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "./ui/skeleton"

type ShareCardProps = {
  token: string
  answerUrl: string
}

const ShareCard = ({ token, answerUrl }: ShareCardProps) => {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [isQrLoading, setIsQrLoading] = useState(true)

  const fullAnswerUrl = useMemo(() => {
    if (typeof window === "undefined") return answerUrl
    return `${window.location.origin}${answerUrl}`
  }, [answerUrl])

  const qrCodeUrl = useMemo(() => {
    const encoded = encodeURIComponent(fullAnswerUrl)
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`
  }, [fullAnswerUrl])

  const copyText = async (value: string) => {
    setCopyError("")

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError("コピーに失敗しました。もう一度お試しください。")
    }
  }

  const shareWithWebApi = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      return
    }

    setIsSharing(true)

    try {
      await navigator.share({
        title: "招待カードを共有",
        text: `Invitation ID: ${token}`,
        url: fullAnswerUrl,
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="space-y-4">

      <div className="rounded-md border p-3 flex justify-center">
        {isQrLoading && (
          <Skeleton className="size-45" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrCodeUrl}
          alt="招待QRコード"
          width={180}
          height={180}
          className={isQrLoading ? "hidden" : "block"}
          onLoad={() => setIsQrLoading(false)}
          onError={() => setIsQrLoading(false)}
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">Invitation ID</p>
        <div className="flex gap-2">
          <Input value={token} readOnly />
          <Button type="button" variant="outline" onClick={() => copyText(token)}>
            {copied ? <Check/> : <Copy/>}
          </Button>
        </div>
        {copyError && (
          <p className="text-xs text-red-500">{copyError}</p>
        )}
      </div>

      <Button type="button" className="w-full" onClick={shareWithWebApi} disabled={isSharing || typeof navigator === "undefined" || !navigator.share}>
        {isSharing ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
          </span>
        ) : "SNSで共有"}
      </Button>
    </div>
  )
}

export default ShareCard