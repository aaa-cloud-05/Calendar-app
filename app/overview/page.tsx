import Link from 'next/link'
import React from 'react'

const OverviewPage = () => {
  return (
    <div>
      <h1>OverviewPage</h1>
      <div>
        <h1>InvitationCardList</h1>
        <Link href={`/invitation/token`}>Invitation Cards</Link>
      </div>
    </div>
  )
}

export default OverviewPage