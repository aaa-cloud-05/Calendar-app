"use client"

import { useState } from "react"

const getGuestId = () => {
  if (typeof window === "undefined") {
    return ""
  }

  const storedId = localStorage.getItem("guest_id")
  if (storedId) {
    return storedId
  }

  const newId = crypto.randomUUID()
  localStorage.setItem("guest_id", newId)
  return newId
}

export const useGuestUser = () => {
  const [guestId] = useState<string>(getGuestId)

  return guestId
}