"use client"

import { saveRecentInvitation } from "@/app/utils/recentInvitations"
import { useEffect } from "react"

type InvitationRecentTrackerProps = {
  token: string
  title: string
}

export default function InvitationRecentTracker({
  token,
  title,
}: InvitationRecentTrackerProps) {
  useEffect(() => {
    saveRecentInvitation(token, title)
  }, [token, title])

  return null
}