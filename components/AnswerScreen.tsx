"use client"

import { useMemo, useState } from 'react'
import AnswerTile from './AnswerTile'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DateCandidate, ResponseDraft, Tag } from '@/app/types/type'
import { useGuestUser } from '@/hooks/useGuestUser'
import { submitResponse } from '@/app/answer/[token]/action'

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

const AnswerScreen = ({invitation}: { invitation: InvitationPayload }) => {
  const guestId = useGuestUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const anonymousResponseEnabled = invitation.settings?.anonymousResponse ?? false
  const allowComments = invitation.settings?.allowComments ?? true
  const isDeadlinePassed = invitation.settings?.deadline
    ? new Date(invitation.settings.deadline) < new Date()
    : false
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
    if (!guestId || isSubmitting || isDeadlinePassed) return

    setIsSubmitting(true)

    try {
      await submitResponse(invitation.invite_token, {
        invitationId: invitation.id,
        guestId,
        name: response.name,
        availability: response.availability,
        selectedTags,
        comment: response.comment,
      })
    } catch (e) {
      console.error(e)
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
      <Button onClick={handleSubmit} disabled={isSubmitting || !guestId || isDeadlinePassed}>
        {isSubmitting ? "Sending..." : "Send Answer"}
      </Button>

      {isDeadlinePassed && (
        <p className="mt-2 text-xs text-muted-foreground">
          回答期限を過ぎているため、送信を停止しています。
        </p>
      )}
      
      {/* <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(response, null, 2)}
      </pre> */}
    </div>
  )
}

export default AnswerScreen