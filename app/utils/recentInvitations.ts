export const RECENT_INVITATIONS_KEY = "recentInvitations"
const RECENT_INVITATIONS_LIMIT = 5

export type RecentInvitation = {
  token: string
  title: string
  viewedAt: string
}

function isRecentInvitation(value: unknown): value is RecentInvitation {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<RecentInvitation>

  return (
    typeof candidate.token === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.viewedAt === "string"
  )
}

export function readRecentInvitations(): RecentInvitation[] {
  const stored = localStorage.getItem(RECENT_INVITATIONS_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isRecentInvitation)
  } catch {
    return []
  }
}

export function saveRecentInvitation(token: string, title: string) {
  const trimmedToken = token.trim()
  const trimmedTitle = title.trim()

  if (!trimmedToken || !trimmedTitle) return

  const current = readRecentInvitations()
  const withoutCurrentToken = current.filter((item) => item.token !== trimmedToken)

  const next: RecentInvitation[] = [
    {
      token: trimmedToken,
      title: trimmedTitle,
      viewedAt: new Date().toISOString(),
    },
    ...withoutCurrentToken,
  ].slice(0, RECENT_INVITATIONS_LIMIT)

  localStorage.setItem(RECENT_INVITATIONS_KEY, JSON.stringify(next))
}