"use client"

import { Card } from "./ui/card"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Circle, Triangle, X } from "lucide-react"
import { DateCandidate, ResponseDraft, AvailabilityStatus, Tag } from "@/app/types/type"

type Props = {
  candidates: DateCandidate[]
  tags: Tag[]
  response: ResponseDraft
  setResponse: React.Dispatch<React.SetStateAction<ResponseDraft>>
}

export default function AnswerTile({
  candidates,
  tags,
  response,
  setResponse,
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

        return (
          <Card key={candidate.id} className="p-3 space-y-2">

            {/* date */}
            <div className="text-sm font-medium">
              {new Date(candidate.date).toLocaleDateString()}
            </div>

            {/* tabs */}
            <Tabs value={status ?? ""}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="yes"
                  onClick={() => setStatus(candidate.id, "yes")}
                >
                  <Circle size={18}/>
                </TabsTrigger>
                <TabsTrigger
                  value="maybe"
                  onClick={() => setStatus(candidate.id, "maybe")}
                >
                  <Triangle size={18}/>
                </TabsTrigger>
                <TabsTrigger
                  value="no"
                  onClick={() => setStatus(candidate.id, "no")}
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
