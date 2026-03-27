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

type InvitationPayload = {
  id: string
  invite_token: string
  date_candidates: DateCandidate[]
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
  const [response, setResponse] = useState<ResponseDraft>({
    invitationToken: invitation.invite_token,
    name: "",
    availability: [],
    comment: "",
  })

  const TAG = [
    {id:"1", label: "オンラインで"},
    {id:"2", label: "遅刻"},
  ]

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

    const guestId = getOrCreateGuestId()

    setIsSubmitting(true)
    setSubmitError("")

    try {
      await submitResponse(invitation.invite_token, {
        invitationId: invitation.id,
        guestId,
        name: response.name,
        availability: response.availability,
        selectedTags,
        comment: response.comment,
      })
      setIsNavigating(true)
      router.push(`/invitation/${invitation.invite_token}`)
    } catch (e) {
      console.error(e)
      setSubmitError("送信に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* name */}
      <Input
        className="w-full outline-none"
        placeholder={anonymousResponseEnabled ? "匿名設定されています" : "名前"}
        value={response.name}
        disabled={anonymousResponseEnabled}
        onChange={(e) =>
          setResponse((prev) => ({
            ...prev,
            name: e.target.value
          }))
        }
      />
      
      <AnswerTile
        candidates={invitation.date_candidates}
        tags={TAG}
        response={response}  
        setResponse={setResponse}
      />
      
      {/* comment */}
      <Textarea
        className="w-full text-sm border rounded-lg p-3 resize-none"
        placeholder={allowComments ? "コメント" : "コメントは許可されていません"}
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
      <Button onClick={handleSubmit} disabled={isSubmitting || isNavigating || isDeadlinePassed}>
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
