"use client"

import { useMemo, useState } from 'react'
import AnswerTile from './AnswerTile'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DateCandidate, ResponseDraft, Tag } from '@/app/types/type'
import { submitResponse } from '@/app/answer/[token]/action'
import { Spinner } from './ui/spinner'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type InvitationPayload = {
  id: string
  invite_token: string
  date_candidates: DateCandidate[]
  start_time?: string | null
  end_time?: string | null
  tags?: Tag[]
  settings?: {
    anonymousResponse?: boolean
    allowComments?: boolean
    deadline?: string
  }
}

const getOrCreateGuestId = () => {
  const storedId = localStorage.getItem("guest_id")
  if (storedId) {
    return storedId
  }

  const newId = crypto.randomUUID()
  localStorage.setItem("guest_id", newId)
  return newId
}

const AnswerScreen = ({
  invitation,
  initialDeadlinePassed,
}: {
  invitation: InvitationPayload
  initialDeadlinePassed: boolean
}) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const anonymousResponseEnabled = invitation.settings?.anonymousResponse ?? false
  const allowComments = invitation.settings?.allowComments ?? true
  const isDeadlinePassed = initialDeadlinePassed
  const isNameRequired = !anonymousResponseEnabled
  const [response, setResponse] = useState<ResponseDraft>({
    invitationToken: invitation.invite_token,
    name: "",
    availability: invitation.date_candidates.map((candidate) => ({
      candidateId: candidate.id,
      status: "maybe",
      badges: [],
    })),
    comment: "",
  })

  const TAG = [
    {id:"1", label: "オンラインで"},
    {id:"2", label: "遅刻"},
  ]
  const trimmedName = response.name?.trim()

  const selectedTags = useMemo(() => {
    const map = new Map<string, Tag>()

    response.availability.forEach((a) => {
      a.badges.forEach((badge) => {
        map.set(badge.id, badge)
      })
    })

    return Array.from(map.values())
  }, [response.availability])

  const handleSubmit = async () => {
    if (isSubmitting || isNavigating || isDeadlinePassed) return
    if (isNameRequired && !trimmedName) {
      toast.warning("名前を入力してください")
      setSubmitError("名前を入力してください")
      return
    }
    const guestId = getOrCreateGuestId()

    setIsSubmitting(true)
    setSubmitError("")
    const loadingToastId = toast.loading("回答を送信しています...")

    try {
      await submitResponse(invitation.invite_token, {
        invitationId: invitation.id,
        guestId,
        name: response.name ?? "" ,
        availability: response.availability,
        selectedTags,
        comment: response.comment,
      })
      toast.success("回答を送信しました。", {
        id: loadingToastId,
        description: "みんなの回答を確認しよう。",
      })
      setIsNavigating(true)
      router.push(`/invitation/${invitation.invite_token}`)
    } catch (e) {
      console.error(e)
      toast.error("回答の送信に失敗しました。", {
        id: loadingToastId,
        description: "時間をおいて再度お試しください。",
      })
      setSubmitError("送信に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* name */}
      <div className="space-y-2">
        <label htmlFor="answer-name" className="text-sm text-gray-700">
          名前
          {isNameRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
        <Input
          id="answer-name"
          className="h-11 w-full border-gray-300 bg-white outline-none"
          placeholder={anonymousResponseEnabled ? "匿名設定されています" : "例: 太郎"}
          value={response.name ?? ""}
          disabled={anonymousResponseEnabled}
          onChange={(e) =>
            setResponse((prev) => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
      </div>
      
      <AnswerTile
        candidates={invitation.date_candidates}
        tags={TAG}
        response={response}
        setResponse={setResponse}
        eventTimeFallback={{
          start: invitation.start_time,
          end: invitation.end_time,
        }}
      />
      
      {/* comment */}
      <div className="space-y-2">
        <label htmlFor="answer-comment" className="text-sm text-gray-700">
          コメント
        </label>
        <Textarea
          id="answer-comment"
          className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm"
          placeholder={allowComments ? "補足があれば入力してください" : "コメントは許可されていません"}
          rows={3}
          value={response.comment ?? ""}
          disabled={!allowComments}
          onChange={(e) =>
            setResponse((prev) => ({
              ...prev,
              comment: e.target.value,
            }))
          }
        />
      </div>
      <Button
        className="h-11 w-full"
        onClick={handleSubmit}
        disabled={isSubmitting || isNavigating || isDeadlinePassed || (isNameRequired && !trimmedName)}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
            Sending...
          </span>
        ) : "Send Answer"}
      </Button>
      {submitError && (
        <p className="mt-2 text-xs text-red-500">
          {submitError}
        </p>
      )}

      {isDeadlinePassed && (
        <p className="mt-2 text-xs text-muted-foreground">
          回答期限を過ぎているため、送信を停止しています。
        </p>
      )}
      
      {/* <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(response, null, 2)}
      </pre> */}

      {isNavigating && (
        <div className="fixed inset-0 z-60 bg-white/90 backdrop-blur-sm">
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-gray-700">
            <Spinner className="size-6" />
            <p className="text-sm">回答を反映中...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnswerScreen
