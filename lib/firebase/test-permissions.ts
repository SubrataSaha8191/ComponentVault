// Firebase Connection Test Script
// Run this in browser console or create a test page

import { auth, db } from './config'
import { 
  signInAnonymously,
  onAuthStateChanged 
} from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  limit 
} from 'firebase/firestore'

export const testFirebasePermissions = async () => {
  console.log('🔥 Testing Firebase Permissions...')
  
  try {
    // Test 1: Check if user is authenticated
    console.log('1. Checking authentication status...')
    const user = auth.currentUser
    
    if (!user) {
      console.log('❌ No user authenticated. Attempting anonymous sign-in...')
      try {
        const userCredential = await signInAnonymously(auth)
        console.log('✅ Anonymous sign-in successful:', userCredential.user.uid)
      } catch (authError) {
        console.error('❌ Anonymous sign-in failed:', authError)
        return false
      }
    } else {
      console.log('✅ User already authenticated:', user.uid)
    }
    
    // Test 2: Try to read from components collection
    console.log('2. Testing read permissions...')
    try {
      const q = query(collection(db, 'components'), limit(1))
      const snapshot = await getDocs(q)
      console.log('✅ Read permission successful. Documents found:', snapshot.size)
    } catch (readError: any) {
      console.error('❌ Read permission failed:', readError)
      if (readError?.code === 'permission-denied') {
        console.log('💡 Solution: Update Firestore security rules')
        return false
      }
    }
    
    // Test 3: Try to write to debug-tests collection
    console.log('3. Testing write permissions...')
    try {
      const testData = {
        test: true,
        timestamp: new Date(),
        userId: auth.currentUser?.uid || 'anonymous',
        message: 'Permission test'
      }
      
      const docRef = await addDoc(collection(db, 'debug-tests'), testData)
      console.log('✅ Write permission successful. Document ID:', docRef.id)
    } catch (writeError: any) {
      console.error('❌ Write permission failed:', writeError)
      if (writeError?.code === 'permission-denied') {
        console.log('💡 Solution: Update Firestore security rules to allow writes')
        return false
      }
    }
    
    // Test 4: Try to write to components collection
    console.log('4. Testing component creation permissions...')
    try {
      const componentData = {
        title: 'Test Component',
        description: 'Test description',
        code: '// Test code',
        authorId: auth.currentUser?.uid || 'anonymous',
        authorName: 'Test User',
        category: 'button',
        framework: 'react',
        isPublic: true,
        createdAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'components'), componentData)
      console.log('✅ Component creation successful. Document ID:', docRef.id)
    } catch (componentError: any) {
      console.error('❌ Component creation failed:', componentError)
      if (componentError?.code === 'permission-denied') {
        console.log('💡 Solution: Ensure user is authenticated and authorId matches auth.uid')
        return false
      }
    }
    
    console.log('🎉 All permission tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    console.log('🔧 Troubleshooting steps:')
    console.log('1. Check Firebase project configuration')
    console.log('2. Verify Firestore security rules')
    console.log('3. Ensure user authentication is working')
    console.log('4. Check browser console for detailed errors')
    return false
  }
}

// Usage: testFirebasePermissions()