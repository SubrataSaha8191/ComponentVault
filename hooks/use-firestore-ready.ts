/**
 * Custom hook to ensure Firebase Auth and Firestore are ready before making queries
 * This prevents "Missing or insufficient permissions" errors
 */

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface FirestoreReadyState {
  isReady: boolean
  user: any
  isAuthenticated: boolean
}

export function useFirestoreReady(): FirestoreReadyState {
  const { user, loading: authLoading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      // Small delay to ensure Firestore is fully initialized
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [authLoading])

  return {
    isReady: isReady && !authLoading,
    user,
    isAuthenticated: !!user
  }
}
