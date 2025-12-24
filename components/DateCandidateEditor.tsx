"use client"

import { DateCandidate } from "@/app/types/type"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

type Props = {
  candidate?: DateCandidate
  onChange: (candidate: DateCandidate) => void
}

const DateCandidateEditor = ({ candidate, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  if (!candidate) {
    return (
      <p className="text-xs text-muted-foreground">選択した日付の詳細を設定できます</p>
    )
  }

  return (
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-bold"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "-rotate-90" : ""
            }`}
          />
          {candidate.date.toLocaleDateString()}
        </div>
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          <div className="flex gap-2">
            <Input
              type="time"
              value={candidate.startTime ?? ""}
              onChange={(e) =>
                onChange({ ...candidate, startTime: e.target.value })
              }
            />
            <Input
              type="time"
              value={candidate.endTime ?? ""}
              onChange={(e) =>
                onChange({ ...candidate, endTime: e.target.value })
              }
            />
          </div>

          <Textarea
            placeholder="コメント（任意）"
            rows={2}
            value={candidate.comment ?? ""}
            onChange={(e) =>
              onChange({ ...candidate, comment: e.target.value })
            }
          />
        </div>
      )}
    </div>
  )
}

export default DateCandidateEditor
