import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useEffect } from 'react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file')
}

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser()
  const syncUser = useMutation(api.users.syncUser)

  useEffect(() => {
    if (isSignedIn && user) {
      syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || undefined,
      }).catch((error) => {
        console.error('Failed to sync user:', error)
      })
    }
  }, [isSignedIn, user?.id, syncUser])

  return <>{children}</>
}

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <UserSyncWrapper>{children}</UserSyncWrapper>
    </ClerkProvider>
  )
}
