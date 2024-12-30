import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import HomePage from 'src/components/home/homepage'
import { useAuth } from 'src/hooks/useAuth'

export default function Index() {
  const router = useRouter()

  return (
    <div>
      <HomePage />
    </div>
  )
}
