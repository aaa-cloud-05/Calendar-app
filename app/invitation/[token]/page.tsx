import InvitationHeroCard from "@/components/HeroCard"
import { deserializeInvitation } from "@/lib/invitation/deserialize"

type Props = {
  params: { token: string }
}

const InvitePage = async ({ params }: Props) => {
  const res = await fetch(
    `localhost:3000/api/invitations/${params.token}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return <div>招待が見つかりません</div>
  }

  const dbInvitation = await res.json()
  const invitation = deserializeInvitation(dbInvitation)

  return <InvitationHeroCard draft={invitation} participants={[]} />
}

export default InvitePage
