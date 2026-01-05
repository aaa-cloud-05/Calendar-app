"use client"

import { useEffect, useState } from "react"

export const useGuestUser = () => {
  const [guestId, setGuestId] = useState<string>("")

  useEffect(() => {
    const storedId = localStorage.getItem("guest_id")
    if (storedId) {
      setGuestId(storedId)
    } else {
      const newId = crypto.randomUUID()
      localStorage.setItem("guest_id", newId)
      setGuestId(newId)
    }
  }, [])

  return guestId
}