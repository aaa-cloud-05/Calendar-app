"use client"

import { useState } from 'react'
import AnswerTile from './AnswerTile'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ResponseDraft } from '@/app/types/type'

const AnswerScreen = ({invitation}: { invitation: any }) => {
  const [response, setResponse] = useState<ResponseDraft>({
    invitationToken: "",
    name: "",
    availability: [],
    comment: "",
  })

  const TAG = [
    {id:"1", label: "オンラインで"},
    {id:"2", label: "遅刻"},
  ]

  return (
    <div>
      {/* name */}
      <Input
        className="w-full outline-none"
        placeholder="名前"
        value={response.name}
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
        placeholder="コメント"
        rows={3}
        value={response.comment ?? ""}
        onChange={(e) =>
          setResponse((prev) => ({
            ...prev,
            comment: e.target.value,
          }))
        }
      />
      <Button>Send Answer</Button>
      <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  )
}

export default AnswerScreen