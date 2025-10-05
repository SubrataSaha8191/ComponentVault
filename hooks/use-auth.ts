import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useEffect, useState } from 'react';
import { User } from '@/lib/firebase/types';
import { getUserById } from '@/lib/firebase/firestore';

export function useAuth() {
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser) {
      getUserById(firebaseUser.uid)
        .then((userData) => {
          setUser(userData);
          setUserLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          setUserLoading(false);
        });
    } else {
      setUser(null);
      setUserLoading(false);
    }
  }, [firebaseUser]);

  return {
    user,
    firebaseUser,
    loading: loading || userLoading,
    error,
    isAuthenticated: !!firebaseUser,
  };
}
