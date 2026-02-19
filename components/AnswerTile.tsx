"use client"

import { Card } from "./ui/card"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Circle, Triangle, X } from "lucide-react"
import { DateCandidate, ResponseDraft, AvailabilityStatus } from "@/app/types/type"

type Props = {
  candidates: DateCandidate[]
  response: ResponseDraft
  setResponse: React.Dispatch<React.SetStateAction<ResponseDraft>>
}

export default function AnswerTile({
  candidates,
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
            <div className="text-xs text-muted-foreground">
              Tag Section
            </div>

          </Card>
        )
      })}
    </div>
  )
}
