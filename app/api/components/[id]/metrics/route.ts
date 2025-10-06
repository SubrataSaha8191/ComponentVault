import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import * as admin from 'firebase-admin'

type MetricAction = 'view' | 'download' | 'copy' | 'like' | 'unlike'

const increment = admin.firestore.FieldValue.increment

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json().catch(() => ({}))
    const action: MetricAction = body?.action

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
    }

    const ref = adminDb.collection('components').doc(id)

    switch (action) {
      case 'view': {
        await ref.update({ views: increment(1), 'stats.views': increment(1) })
        break
      }
      case 'download': {
        await ref.update({ downloads: increment(1), 'stats.downloads': increment(1) })
        break
      }
      case 'copy': {
        await ref.update({ copies: increment(1) })
        break
      }
      case 'like': {
        await ref.update({ likes: increment(1) })
        break
      }
      case 'unlike': {
        // Prevent negative likes via a transaction clamp
        await adminDb.runTransaction(async (tx) => {
          const snap = await tx.get(ref)
          if (!snap.exists) return
          const current = (snap.data()?.likes as number) || 0
          const next = Math.max(0, current - 1)
          tx.update(ref, { likes: next })
        })
        break
      }
      default:
        return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error updating metrics:', error)
    return NextResponse.json({ error: 'Failed to update metrics' }, { status: 500 })
  }
}
