// Firebase Debug Utility (Updated for non-storage implementation)
// Use this to test Firebase connectivity and configuration

import { auth, db } from './config'
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  limit 
} from 'firebase/firestore'

export const debugFirebase = {
  // Test authentication
  testAuth: () => {
    console.log('🔐 Testing Firebase Authentication...')
    console.log('Auth instance:', auth)
    console.log('Current user:', auth.currentUser)
    console.log('Auth domain:', auth.config.authDomain)
    return !!auth
  },

  // Test Firestore connection
  testFirestore: async () => {
    console.log('📚 Testing Firestore Database...')
    try {
      console.log('Firestore instance:', db)
      console.log('Firestore app:', db.app.name)
      
      // Try to read from a collection
      const testQuery = query(collection(db, 'components'), limit(1))
      const snapshot = await getDocs(testQuery)
      console.log('✅ Firestore connection successful')
      console.log('Components collection accessible:', !snapshot.empty)
      return true
    } catch (error) {
      console.error('❌ Firestore connection failed:', error)
      return false
    }
  },

  // Test image upload alternatives
  testImageUpload: async (testFile?: File) => {
    console.log('� Testing image upload alternatives...')
    try {
      // Create a test canvas with image data
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#4CAF50'
        ctx.fillRect(0, 0, 100, 100)
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.fillText('TEST', 25, 55)
      }
      
      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const testBase64 = canvas.toDataURL('image/png')
            console.log('✅ Base64 conversion successful')
            console.log('Base64 length:', testBase64.length)
            resolve({ success: true, base64Length: testBase64.length })
          } else {
            console.log('❌ Base64 conversion failed')
            resolve({ success: false })
          }
        }, 'image/png')
      })
    } catch (error: any) {
      console.error('❌ Image upload test failed:', error)
      return { success: false, error: error?.message || 'Unknown error' }
    }
  },

  // Test Firestore write with permission check
  testFirestoreWrite: async () => {
    console.log('✏️ Testing Firestore write permissions...')
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        console.log('⚠️ No authenticated user. Some operations may fail.')
      }
      
      const testData = {
        test: true,
        timestamp: new Date(),
        message: 'Firebase debug test (no storage)',
        imageMethod: 'base64',
        userId: auth.currentUser?.uid || 'anonymous'
      }
      
      const docRef = await addDoc(collection(db, 'debug-tests'), testData)
      console.log('✅ Firestore write successful')
      console.log('Document ID:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('❌ Firestore write failed:', error)
      
      // Provide specific guidance for permission errors
      if (error?.code === 'permission-denied') {
        console.log('🔧 Permission denied - possible solutions:')
        console.log('1. Update Firestore security rules')
        console.log('2. Ensure user is authenticated')
        console.log('3. Check that rules allow writes to debug-tests collection')
      }
      
      return null
    }
  },

  // Test component creation with permission check
  testComponentCreation: async () => {
    console.log('📝 Testing component creation permissions...')
    try {
      if (!auth.currentUser) {
        console.log('❌ User must be authenticated to create components')
        return null
      }
      
      const testComponentData = {
        title: 'Debug Test Component',
        description: 'Test component for permission validation',
        code: '// Test component code\nfunction TestComponent() {\n  return <div>Test</div>\n}',
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Test User',
        authorEmail: auth.currentUser.email || '',
        category: 'button',
        framework: 'react',
        tags: ['test', 'debug'],
        isPublic: true,
        isPublished: true,
        createdAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'components'), testComponentData)
      console.log('✅ Component creation successful')
      console.log('Test component ID:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('❌ Component creation failed:', error)
      
      if (error?.code === 'permission-denied') {
        console.log('🔧 Component creation permission denied - solutions:')
        console.log('1. Ensure user is authenticated')
        console.log('2. Check that authorId matches authenticated user UID')
        console.log('3. Update Firestore rules to allow component creation')
      }
      
      return null
    }
  },

  // Run all tests (updated for no storage)
  runAllTests: async () => {
    console.log('🚀 Running Firebase Debug Tests (No Storage)...')
    console.log('========================================')
    
    const results = {
      auth: debugFirebase.testAuth(),
      firestore: await debugFirebase.testFirestore(),
      imageUpload: !!(await debugFirebase.testImageUpload() as any)?.success,
      firestoreWrite: !!(await debugFirebase.testFirestoreWrite()),
      componentCreation: !!(await debugFirebase.testComponentCreation())
    }
    
    console.log('========================================')
    console.log('📊 Test Results:')
    console.log('Auth:', results.auth ? '✅' : '❌')
    console.log('Firestore Read:', results.firestore ? '✅' : '❌')
    console.log('Image Processing:', results.imageUpload ? '✅' : '❌')
    console.log('Firestore Write:', results.firestoreWrite ? '✅' : '❌')
    console.log('Component Creation:', results.componentCreation ? '✅' : '❌')
    
    const allPassed = Object.values(results).every(Boolean)
    console.log('========================================')
    
    if (!allPassed) {
      console.log('⚠️ Some tests failed - Common solutions:')
      if (!results.firestoreWrite || !results.componentCreation) {
        console.log('🔧 For permission errors:')
        console.log('1. Go to Firebase Console → Firestore Database → Rules')
        console.log('2. Copy the rules from firestore-rules-updated.txt')
        console.log('3. Publish the new rules')
        console.log('4. Ensure user is authenticated before testing')
      }
    }
    
    console.log(`🎯 Overall Status: ${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`)
    console.log('📝 Note: Using base64/ImgBB instead of Firebase Storage')
    
    return results
  },

  // Check environment variables (updated)
  checkEnvVars: () => {
    console.log('🔧 Checking Environment Variables...')
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]
    
    const optionalVars = [
      'NEXT_PUBLIC_IMGBB_API_KEY'
    ]
    
    const missing: string[] = []
    const present: string[] = []
    
    requiredVars.forEach(varName => {
      const value = process.env[varName]
      if (value && value !== 'your_*_here') {
        present.push(varName)
        console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
      } else {
        missing.push(varName)
        console.log(`❌ ${varName}: Missing or placeholder`)
      }
    })
    
    console.log('\n🔧 Optional Environment Variables:')
    optionalVars.forEach(varName => {
      const value = process.env[varName]
      if (value && value !== 'your_*_here') {
        console.log(`✅ ${varName}: ${value.substring(0, 10)}... (ImgBB enabled)`)
      } else {
        console.log(`⚪ ${varName}: Not set (will use base64 fallback)`)
      }
    })
    
    if (missing.length > 0) {
      console.log('\n⚠️ Missing required environment variables:', missing)
      console.log('Please check your .env.local file')
    } else {
      console.log('\n✅ All required environment variables are set')
    }
    
    return { present, missing, allSet: missing.length === 0 }
  }
}

// Export for use in components or pages
export default debugFirebase

// Usage in component:
// import debugFirebase from '@/lib/firebase/debug'
// 
// // In your component or useEffect:
// debugFirebase.checkEnvVars()
// debugFirebase.runAllTests()