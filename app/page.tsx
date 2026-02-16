import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>LP</h1>
      <Link href={`/create`}>Create Button (CTA)</Link>
    </div>
    
  )
}

export default page