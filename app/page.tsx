'use client'

import {useSession} from 'next-auth/react'
import {useEffect} from 'react'

const HomePage = () => {
  const {data: session, status} = useSession()

  useEffect(() => {
    if (session) {
      console.log('Session object:', session) // Check the console for the session details
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'authenticated') {
    return <div>Welcome, {session?.user?.name}</div>
  }

  return <div>Please log in</div>
}

export default HomePage
