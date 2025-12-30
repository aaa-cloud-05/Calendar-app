import { InvitationDraft } from "@/app/types/type"
import InvitationHeroCard from "@/components/HeroCard"

async function getDraft(
  token: string
): Promise<InvitationDraft> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${token}`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("failed")

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { token: string }
}) {
  const draft = await getDraft(params.token)

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationHeroCard
        draft={draft}
        participants={[]}
      />
    </div>
  )
}
