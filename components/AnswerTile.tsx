"use client"

import { Card } from "./ui/card"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Circle, Triangle, X } from "lucide-react"
import { DateCandidate, ResponseDraft, AvailabilityStatus, Tag } from "@/app/types/type"

function formatTimePair(
  startRaw: string | null | undefined,
  endRaw: string | null | undefined
): string | null {
  const start = startRaw?.trim()
  const end = endRaw?.trim()
  if (start && end) return `${start} - ${end}`
  if (start) return `${start} -`
  if (end) return `- ${end}`
  return null
}

function getCandidateTimeRange(
  candidate: DateCandidate & { start_time?: string; end_time?: string },
  eventFallback?: { start?: string | null; end?: string | null }
) {
  const direct = formatTimePair(
    candidate.startTime ?? candidate.start_time,
    candidate.endTime ?? candidate.end_time
  )
  if (direct) return direct
  return formatTimePair(eventFallback?.start, eventFallback?.end)
}

type Props = {
  candidates: DateCandidate[]
  tags: Tag[]
  response: ResponseDraft
  setResponse: React.Dispatch<React.SetStateAction<ResponseDraft>>
  eventTimeFallback?: { start?: string | null; end?: string | null }
}

export default function AnswerTile({
  candidates,
  tags,
  response,
  setResponse,
  eventTimeFallback,
}: Props) {

  function setStatus(candidateId: string, status: AvailabilityStatus) {
    setResponse(prev => {
      const existing = prev.availability.find(
        a => a.candidateId === candidateId
      )
      let newAvailability
      if (existing) {
        newAvailability = prev.availability.map(a =>
          a.candidateId === candidateId
            ? { ...a, status }
            : a
        )
      } else {
        newAvailability = [
          ...prev.availability,
          {
            candidateId,
            status,
            badges: [],
          },
        ]
      }
      return {
        ...prev,
        availability: newAvailability,
      }
    })
  }

  function getStatus(candidateId: string): AvailabilityStatus | undefined {
    return response.availability.find(
      a => a.candidateId === candidateId
    )?.status
  }

  function toggleBadge(candidateId: string, tag: Tag) {
    setResponse(prev => {
      const existing = prev.availability.find(
        a => a.candidateId === candidateId
      )

      if (!existing) {
        return {
          ...prev,
          availability: [
            ...prev.availability,
            {
              candidateId,
              status: "maybe",
              badges: [tag],
            },
          ],
        }
      }

      const hasBadge = existing.badges.some(b => b.id === tag.id)
      return {
        ...prev,
        availability: prev.availability.map(a =>
          a.candidateId === candidateId
            ? {
                ...a,
                badges: hasBadge
                  ? a.badges.filter(b => b.id !== tag.id)
                  : [...a.badges, tag],
              }
            : a
        ),
      }
    })
  }

  function hasBadge(candidateId: string, tagId: string) {
    return response.availability
      .find(a => a.candidateId === candidateId)
      ?.badges.some(b => b.id === tagId)
  }

  return (
    <div className="space-y-3">
      {candidates.map(candidate => {
        const status = getStatus(candidate.id)
        const d = new Date(candidate.date)
        const dateLabel = d.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          weekday: "short",
        })
        const timeLabel = getCandidateTimeRange(
          candidate as DateCandidate & { start_time?: string; end_time?: string },
          eventTimeFallback
        )
        const candidateComment = candidate.comment?.trim()

        return (
          <Card key={candidate.id} className="space-y-2 border border-gray-200 bg-white p-3 shadow-none">

            <div className="space-y-1">
              <div className="text-sm font-medium">{dateLabel}</div>
              {timeLabel && (
                <div className="text-xs text-muted-foreground tabular-nums">
                  {timeLabel}
                </div>
              )}
              {candidateComment && (
                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap break-words border-l-2 border-zinc-200 pl-2">
                  {candidateComment}
                </p>
              )}
            </div>

            {/* tabs */}
            <Tabs value={status ?? "maybe"}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="yes"
                  onClick={() => setStatus(candidate.id, "yes")}
                  className="data-[state=active]:bg-white data-[state=active]:text-emerald-600"
                >
                  <Circle size={18}/>
                </TabsTrigger>
                <TabsTrigger
                  value="maybe"
                  onClick={() => setStatus(candidate.id, "maybe")}
                  className="data-[state=active]:bg-white data-[state=active]:text-amber-600"
                >
                  <Triangle size={18}/>
                </TabsTrigger>
                <TabsTrigger
                  value="no"
                  onClick={() => setStatus(candidate.id, "no")}
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-600"
                >
                  <X size={18}/>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Tag */}
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const active = hasBadge(candidate.id, tag.id)

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleBadge(candidate.id, tag)}
                    className={`text-xs px-2 py-1 border rounded ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>

          </Card>
        )
      })}
    </div>
  )
}
