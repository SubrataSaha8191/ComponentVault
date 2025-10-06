import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'
import * as admin from 'firebase-admin'

// POST - Add components to collection
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const userId = decodedToken.uid
    
    // Check if collection exists and user is owner
    const collectionDoc = await adminDb.collection('collections').doc(id).get()
    
    if (!collectionDoc.exists) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    const collectionData = collectionDoc.data()
    if (collectionData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the owner' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { componentIds } = body
    
    if (!componentIds || !Array.isArray(componentIds) || componentIds.length === 0) {
      return NextResponse.json(
        { error: 'componentIds array is required' },
        { status: 400 }
      )
    }
    
    console.log('Adding componentIds to collection:', componentIds)
    
    // Add components to collection using arrayUnion
    await adminDb.collection('collections').doc(id).update({
      componentIds: admin.firestore.FieldValue.arrayUnion(...componentIds),
      updatedAt: new Date().toISOString(),
    })
    
    console.log('Successfully added components to collection')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding components to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add components', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove component from collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const userId = decodedToken.uid
    
    // Check if collection exists and user is owner
    const collectionDoc = await adminDb.collection('collections').doc(id).get()
    
    if (!collectionDoc.exists) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    const collectionData = collectionDoc.data()
    if (collectionData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the owner' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { componentId } = body
    
    if (!componentId) {
      return NextResponse.json(
        { error: 'componentId is required' },
        { status: 400 }
      )
    }
    
    // Remove component from collection using arrayRemove
    await adminDb.collection('collections').doc(id).update({
      componentIds: admin.firestore.FieldValue.arrayRemove(componentId),
      updatedAt: new Date().toISOString(),
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing component from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove component', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
