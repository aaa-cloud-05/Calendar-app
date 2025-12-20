"use client"

import { Calendar } from "@/components/ui/calendar"
import { ja } from "date-fns/locale"

type Props = {
  selectedDates: Date[]
  onSelectDates: (dates: Date[]) => void
  onActiveDateChange: (date: Date | null) => void
}

const DateCalendar = ({
  selectedDates,
  onSelectDates,
  onActiveDateChange,
}: Props) => {
  return (
    <Calendar
      mode="multiple"
      locale={ja}
      selected={selectedDates}
      onSelect={(dates) => {
        onSelectDates(dates ?? [])
        onActiveDateChange(dates?.at(-1) ?? null)
      }}
      className="rounded-lg border shadow-sm"
    />
  )
}

export default DateCalendar
