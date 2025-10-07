# Dynamic Rendering & Favorites Integration

## Overview
This document outlines the changes required to implement dynamic rendering across all pages and ensure favorites are dynamically updated in real-time when components are added to favorites.

## Problem Statement
1. Component detail page doesn't dynamically check if a component is favorited
2. Browse page uses direct Firestore calls instead of API routes for favorites
3. My Components page doesn't dynamically refresh when favorites are added/removed
4. Favorites don't appear immediately in "Saved Components" tab after being added

## Solution Architecture

### 1. Component Detail Page (`app/component/[id]/page.tsx`)

**Changes Required:**
- Add dynamic favorite status checking via API
- Use `/api/favorites` endpoints instead of local state only
- Refresh favorite status when user changes

**Key Implementation:**
```typescript
// On component load, check if favorited
useEffect(() => {
  const fetchComponent = async () => {
    // ...fetch component data
    
    // Check if component is favorited
    if (user) {
      const favResponse = await fetch(
        `/api/favorites?userId=${user.uid}&componentId=${componentId}`
      )
      if (favResponse.ok) {
        const favData = await favResponse.json()
        setIsFavorited(favData.isFavorited || false)
      }
    }
  }
  
  fetchComponent()
}, [componentId, user])

// Toggle favorite handler
const handleToggleFavorite = async () => {
  if (!user) {
    toast.error("Please sign in to favorite components")
    return
  }
  
  try {
    if (isFavorited) {
      // Remove from favorites
      const response = await fetch(
        `/api/favorites?userId=${user.uid}&componentId=${componentId}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Failed to remove')
      setIsFavorited(false)
      toast.success("Removed from favorites")
    } else {
      // Add to favorites
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          componentId: componentId,
        }),
      })
      if (!response.ok) throw new Error('Failed to add')
      setIsFavorited(true)
      toast.success("Added to favorites")
    }
  } catch (error) {
    toast.error("Failed to update favorites")
  }
}
```

### 2. Browse Page (`app/browse/page.tsx`)

**Current Issue:**
- Uses direct Firestore calls (`addDoc`, `deleteDoc`, `getDocs`)
- This bypasses security rules and doesn't use the API layer

**Changes Required:**
- Replace all direct Firestore calls with API routes
- Use `/api/favorites` for add/remove operations
- Dynamically fetch user favorites on page load

**Before (Lines 337-400+):**
```typescript
const toggleFavorite = async (componentId: string) => {
  // Direct Firestore calls
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", user.uid),
    where("componentId", "==", componentId)
  )
  const querySnapshot = await getDocs(q)
  // ... more direct Firebase operations
}
```

**After:**
```typescript
const toggleFavorite = async (componentId: string) => {
  if (!user) {
    toast.error("Please sign in to add favorites")
    return
  }
  
  try {
    const isFavorited = favorites.includes(componentId)
    
    if (isFavorited) {
      // Remove via API
      const response = await fetch(
        `/api/favorites?userId=${user.uid}&componentId=${componentId}`,
        { method: 'DELETE' }
      )
      
      if (!response.ok) throw new Error('Failed to remove')
      
      setFavorites(prev => prev.filter(id => id !== componentId))
      setUserFavorites(prev => prev.filter(id => id !== componentId))
      toast.success("Removed from favorites")
    } else {
      // Add via API
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          componentId: componentId,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to add')
      
      setFavorites(prev => [...prev, componentId])
      setUserFavorites(prev => [...prev, componentId])
      toast.success("Added to favorites")
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    toast.error("Failed to update favorites")
  }
}
```

**Also Update:** Remove Firebase imports that are no longer needed:
```typescript
// REMOVE these imports:
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
```

### 3. My Components Page (`app/my-components/page.tsx`)

**Current Implementation:** Already uses API routes ✅

**Enhancement Needed:**
- Add real-time refresh when returning from component detail page
- Use visibility API to refresh favorites when tab becomes visible

**Add This:**
```typescript
// Add visibility listener to refresh when tab becomes visible
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && user) {
      // Refresh saved components when user returns to tab
      fetchData()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}, [user])
```

**Also add refresh on focus:**
```typescript
// Refresh when component mounts or user comes back
useEffect(() => {
  const handleFocus = () => {
    if (user) {
      fetchData()
    }
  }
  
  window.addEventListener('focus', handleFocus)
  
  return () => {
    window.removeEventListener('focus', handleFocus)
  }
}, [user])
```

## File-by-File Changes

### File 1: `app/component/[id]/page.tsx`
**Status:** ⚠️ NEEDS UPDATE

**Changes:**
1. Add `isFavorited` state
2. Add dynamic favorite checking in `useEffect`
3. Update `handleToggleFavorite` to use API routes
4. Remove mock favorite toggle logic

**Lines to modify:** ~100-250

---

### File 2: `app/browse/page.tsx`
**Status:** ⚠️ NEEDS MAJOR UPDATE

**Changes:**
1. Remove all direct Firestore imports
2. Update `toggleFavorite` function (lines ~337-400)
3. Remove `trackActivity` direct Firestore calls
4. Use API routes for all data operations

**Lines to modify:** ~337-400, imports at top

**Imports to REMOVE:**
```typescript
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
```

---

### File 3: `app/my-components/page.tsx`
**Status:** ✅ MOSTLY GOOD

**Enhancement:**
1. Add visibility change listener
2. Add window focus listener
3. Both should trigger `fetchData()` to refresh saved components

**Lines to add:** New `useEffect` hooks after existing ones

---

## Testing Checklist

### Test 1: Component Detail Page Favorites
- [ ] Navigate to any component detail page
- [ ] Click "Add to Favorites" button
- [ ] Verify toast message shows "Added to favorites"
- [ ] Verify button changes to "Favorited" with filled heart icon
- [ ] Click button again
- [ ] Verify toast shows "Removed from favorites"
- [ ] Verify button changes back to "Add to Favorites"

### Test 2: Browse Page Favorites
- [ ] Go to browse page
- [ ] Click heart icon on any component card
- [ ] Verify immediate visual feedback (filled heart)
- [ ] Verify toast message
- [ ] Refresh page
- [ ] Verify favorite status persists

### Test 3: Dynamic Updates in My Components
- [ ] Go to My Components page, "Saved Components" tab
- [ ] Open new tab, navigate to browse page
- [ ] Add a component to favorites
- [ ] Return to My Components tab
- [ ] Verify the new favorite appears automatically (may need to click tab or refresh)

### Test 4: Cross-Page Consistency
- [ ] Add component to favorites from browse page
- [ ] Navigate to component detail page
- [ ] Verify it shows as favorited
- [ ] Remove from favorites
- [ ] Navigate back to browse
- [ ] Verify it's no longer favorited there

### Test 5: Authentication States
- [ ] Try to favorite while logged out
- [ ] Verify error message shown
- [ ] Log in
- [ ] Try to favorite
- [ ] Verify it works

## API Routes Reference

### GET `/api/favorites`
**Query Params:**
- `userId` (required): User's UID
- `componentId` (optional): Specific component to check

**Returns:**
- If `componentId` provided: `{ isFavorited: boolean }`
- If only `userId`: `Array<Component>` (all user favorites)

### POST `/api/favorites`
**Body:**
```json
{
  "userId": "string",
  "componentId": "string"
}
```

**Returns:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

### DELETE `/api/favorites`
**Query Params:**
- `userId` (required)
- `componentId` (required)

**Returns:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

## Benefits of This Implementation

1. **Consistency:** All pages use the same API layer
2. **Security:** Firebase security rules are enforced through API routes
3. **Real-time Updates:** Changes reflect immediately across the app
4. **Better UX:** Users see their favorites update without manual refresh
5. **Maintainability:** Single source of truth for favorites logic
6. **Scalability:** API routes can be optimized/cached independently

## Implementation Priority

1. **HIGH:** Update browse page to use API routes (security issue)
2. **HIGH:** Update component detail page favorite checking
3. **MEDIUM:** Add auto-refresh to my-components page
4. **LOW:** Add optimistic UI updates for better perceived performance

## Notes

- All API routes already exist and are tested
- No database schema changes required
- Backward compatible with existing data
- Can be implemented incrementally

## Next Steps

1. Update `app/browse/page.tsx` - remove Firestore imports, update `toggleFavorite`
2. Update `app/component/[id]/page.tsx` - add dynamic favorite checking
3. Enhance `app/my-components/page.tsx` - add visibility listeners
4. Test all scenarios from checklist
5. Monitor for any console errors
6. Verify Firebase security rules are working

---

**Created:** $(date)
**Status:** Ready for Implementation
**Priority:** HIGH
