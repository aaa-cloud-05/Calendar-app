"use client"

import { useState } from "react"
import { DateCandidate } from "@/app/types/type"
import DateCalendar from "./DateCalendar"
import DateCandidateEditor from "./DateCandidateEditor"

type Props = {
  dateCandidates: DateCandidate[]
  onChange: (candidates: DateCandidate[]) => void
}

const DateCandidateSection = ({ dateCandidates, onChange }: Props) => {
  const [activeDate, setActiveDate] = useState<Date | null>(null)

  const selectedDates = dateCandidates.map((c) => c.date)

  const handleSelectDates = (dates: Date[]) => {
    onChange(
      dates.map((date) => {
        const existing = dateCandidates.find(
          (c) => c.date.toDateString() === date.toDateString()
        )
        return existing ?? { id: crypto.randomUUID(), date }
      })
    )
  }

  const activeCandidate = dateCandidates.find(
    (c) => c.date.toDateString() === activeDate?.toDateString()
  )

  const updateCandidate = (updated: DateCandidate) => {
    onChange(
      dateCandidates.map((c) =>
        c.date.toDateString() === updated.date.toDateString()
          ? updated
          : c
      )
    )
  }

  return (
    <section className="space-y-4">
      <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1">
        日程候補
      </label>

      <div className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-center">
          <DateCalendar
            selectedDates={selectedDates}
            onSelectDates={handleSelectDates}
            onActiveDateChange={setActiveDate}
          />
        </div>
        

        <DateCandidateEditor
          candidate={activeCandidate}
          onChange={updateCandidate}
        />
      </div>
      
    </section>
  )
}

export default DateCandidateSection
