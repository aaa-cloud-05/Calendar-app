"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const page = () => {
  return (
    <div className="p-4">
      <input
        type="text"
        className='border'
      />
      <input
        type="text"
        className='border'
      />
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        locale='ja'
        dayHeaderContent={(arg) => arg.date.getDate().toString()}
        headerToolbar={{
          // left: "",
          center: "fff",
          right: ""
        }}
        events={[
          {
            id: "1",
            title: "課題レポート",
            start: "2025-12-10",
            end: "2025-12-12",
          },
          { title: 'イベント2', date: '2025-12-15' }
        ]}
        dateClick={(info) => {
          console.log(info.dateStr) // "2025-12-10"
        }}
        selectable={true}
        select={(info) => {
          console.log(info.start, info.end)
        }}
        selectMirror
      />
    </div>
  )
}

export default page