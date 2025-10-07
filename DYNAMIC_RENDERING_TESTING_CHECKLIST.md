# Dynamic Rendering - Testing Checklist

## Pre-Test Setup

- [ ] Ensure you're logged in with a test account
- [ ] Clear browser cache and local storage
- [ ] Open browser developer console (F12)
- [ ] Have two browser tabs ready for multi-tab tests

---

## Test Suite 1: Browse Page Favorites ⭐

### Test 1.1: Add to Favorites
- [ ] Navigate to `/browse` page
- [ ] Find a component you haven't favorited
- [ ] Click the heart icon (❤️)
- [ ] **Expected Results:**
  - [ ] Heart icon fills in with red color
  - [ ] Toast notification shows "Added to favorites"
  - [ ] No console errors
  - [ ] Page doesn't reload

### Test 1.2: Remove from Favorites
- [ ] On the same component from Test 1.1
- [ ] Click the filled heart icon again
- [ ] **Expected Results:**
  - [ ] Heart icon empties (outline only)
  - [ ] Toast notification shows "Removed from favorites"
  - [ ] No console errors
  - [ ] Page doesn't reload

### Test 1.3: Multiple Favorites
- [ ] Add 3 different components to favorites
- [ ] **Expected Results:**
  - [ ] All 3 hearts fill in correctly
  - [ ] 3 separate toast notifications
  - [ ] All additions saved (check My Components)

### Test 1.4: Unauthenticated Access
- [ ] Log out of your account
- [ ] Try to click a heart icon
- [ ] **Expected Results:**
  - [ ] Toast shows "Please sign in to add favorites"
  - [ ] Heart doesn't fill in
  - [ ] Redirected to login or shown auth modal

---

## Test Suite 2: My Components Auto-Refresh ⭐⭐

### Test 2.1: Visibility Change Refresh
- [ ] Open `/my-components` in Tab A
- [ ] Go to "Saved Components" tab
- [ ] Note the current count of saved components
- [ ] Open `/browse` in Tab B
- [ ] In Tab B, add a new component to favorites
- [ ] Switch back to Tab A (My Components)
- [ ] **Expected Results:**
  - [ ] Page automatically refreshes (may take 1-2 seconds)
  - [ ] New favorite appears in "Saved Components"
  - [ ] Count increases by 1
  - [ ] No manual refresh needed

### Test 2.2: Window Focus Refresh
- [ ] Have My Components page open
- [ ] Minimize browser or switch to another application
- [ ] Open another browser/device
- [ ] Add a favorite using another browser/device
- [ ] Return to original browser window
- [ ] Click on browser window to focus it
- [ ] **Expected Results:**
  - [ ] Page refreshes automatically
  - [ ] New favorite appears
  - [ ] No errors in console

### Test 2.3: Tab Switch Multiple Times
- [ ] Open My Components (Tab A)
- [ ] Open Browse (Tab B)
- [ ] Add favorite in Tab B
- [ ] Switch to Tab A → verify it appears
- [ ] Switch back to Tab B
- [ ] Add another favorite
- [ ] Switch to Tab A → verify it appears
- [ ] Repeat 2 more times
- [ ] **Expected Results:**
  - [ ] All favorites appear correctly
  - [ ] No performance issues
  - [ ] No duplicate API calls visible in Network tab

---

## Test Suite 3: Component Detail Page (If Updated) ⭐

### Test 3.1: Initial Load State
- [ ] Navigate to any component detail page (e.g., `/component/abc123`)
- [ ] Wait for page to load
- [ ] **Expected Results:**
  - [ ] If component is favorited: heart is filled
  - [ ] If not favorited: heart is outlined
  - [ ] Correct state shown immediately on load

### Test 3.2: Add Favorite from Detail Page
- [ ] On a component detail page (not favorited)
- [ ] Click "Add to Favorites" button
- [ ] **Expected Results:**
  - [ ] Button changes to "Favorited"
  - [ ] Heart icon fills in
  - [ ] Toast shows "Added to favorites"
  - [ ] Button color/style changes

### Test 3.3: Remove Favorite from Detail Page
- [ ] On a component detail page (favorited)
- [ ] Click "Favorited" button
- [ ] **Expected Results:**
  - [ ] Button changes to "Add to Favorites"
  - [ ] Heart icon empties
  - [ ] Toast shows "Removed from favorites"
  - [ ] Button returns to normal style

### Test 3.4: State Persistence
- [ ] Add component to favorites from detail page
- [ ] Navigate away (e.g., to browse)
- [ ] Navigate back to same component detail page
- [ ] **Expected Results:**
  - [ ] Component still shows as favorited
  - [ ] Heart is filled
  - [ ] Button shows "Favorited"

---

## Test Suite 4: Cross-Page Consistency ⭐⭐⭐

### Test 4.1: Browse → My Components → Detail
- [ ] Browse page: Add component X to favorites
- [ ] My Components page: Verify component X appears in "Saved Components"
- [ ] Component Detail page: Navigate to component X detail page
- [ ] **Expected Results:**
  - [ ] All 3 pages show component X as favorited
  - [ ] Heart icons are filled on all pages
  - [ ] No discrepancies

### Test 4.2: Detail → Browse → My Components
- [ ] Component Detail: Add component Y to favorites
- [ ] Browse page: Find component Y
- [ ] My Components: Go to "Saved Components"
- [ ] **Expected Results:**
  - [ ] Component Y is favorited on browse page
  - [ ] Component Y appears in My Components
  - [ ] All states synchronized

### Test 4.3: Remove from Different Pages
- [ ] Add component Z to favorites from browse page
- [ ] Verify it appears in My Components
- [ ] Go to component Z detail page
- [ ] Remove it from favorites
- [ ] Return to My Components
- [ ] Switch to "Saved Components" tab
- [ ] **Expected Results:**
  - [ ] Component Z is gone from My Components
  - [ ] Browse page shows it as not favorited
  - [ ] All pages synchronized

---

## Test Suite 5: Edge Cases & Error Handling ⚠️

### Test 5.1: Rapid Clicking
- [ ] Click heart icon multiple times rapidly (5+ clicks in 2 seconds)
- [ ] **Expected Results:**
  - [ ] No duplicate favorites created
  - [ ] Final state is correct (either favorited or not)
  - [ ] No errors in console
  - [ ] UI doesn't break

### Test 5.2: Network Failure Simulation
- [ ] Open Dev Tools → Network tab
- [ ] Set network to "Offline"
- [ ] Try to add favorite
- [ ] **Expected Results:**
  - [ ] Toast shows error message
  - [ ] Heart doesn't fill (or rolls back)
  - [ ] Graceful error handling

### Test 5.3: Invalid Component ID
- [ ] Navigate to `/component/invalid-id-123`
- [ ] Try to favorite
- [ ] **Expected Results:**
  - [ ] Error message shown
  - [ ] No crash
  - [ ] Redirect to 404 or browse page

### Test 5.4: Session Expiry
- [ ] Log in
- [ ] Add some favorites
- [ ] Wait for session to expire (or manually expire token)
- [ ] Try to add another favorite
- [ ] **Expected Results:**
  - [ ] Error message about authentication
  - [ ] Prompted to log in again
  - [ ] No data loss

### Test 5.5: Concurrent Updates
- [ ] Open same component in 2 tabs
- [ ] Add to favorites in Tab 1
- [ ] Add to favorites in Tab 2
- [ ] **Expected Results:**
  - [ ] No duplicate favorites
  - [ ] Both tabs show correct state
  - [ ] No errors

---

## Test Suite 6: Performance & Optimization 🚀

### Test 6.1: Page Load Time
- [ ] Clear cache
- [ ] Navigate to Browse page
- [ ] Record load time (Network tab → Load event)
- [ ] **Expected Results:**
  - [ ] Page loads in < 3 seconds
  - [ ] Favorites status loads quickly
  - [ ] No blocking API calls

### Test 6.2: API Call Efficiency
- [ ] Open Network tab
- [ ] Navigate through app and add/remove favorites
- [ ] Check number of API calls
- [ ] **Expected Results:**
  - [ ] No unnecessary duplicate calls
  - [ ] Debounced or throttled properly
  - [ ] Efficient use of endpoints

### Test 6.3: Large Dataset
- [ ] Add 20+ components to favorites
- [ ] Navigate to My Components → Saved Components
- [ ] **Expected Results:**
  - [ ] All favorites load correctly
  - [ ] No performance lag
  - [ ] Pagination works (if implemented)

### Test 6.4: Memory Leaks
- [ ] Open My Components page
- [ ] Switch tabs 10 times
- [ ] Check browser memory usage (Dev Tools → Memory tab)
- [ ] **Expected Results:**
  - [ ] No significant memory increase
  - [ ] Event listeners cleaned up
  - [ ] No warnings in console

---

## Test Suite 7: Mobile & Responsive 📱

### Test 7.1: Mobile Touch Events
- [ ] Open on mobile device or use mobile emulator
- [ ] Tap heart icons
- [ ] **Expected Results:**
  - [ ] Touch events work correctly
  - [ ] No double-tap required
  - [ ] Visual feedback immediate

### Test 7.2: Tablet View
- [ ] Test on tablet or use tablet emulator (768px width)
- [ ] Add/remove favorites
- [ ] **Expected Results:**
  - [ ] All functionality works
  - [ ] Layout doesn't break
  - [ ] Touch targets are adequate size

### Test 7.3: Small Screen (320px)
- [ ] Set viewport to 320px width
- [ ] Navigate through pages
- [ ] **Expected Results:**
  - [ ] No horizontal scroll
  - [ ] Buttons accessible
  - [ ] Text readable

---

## Test Suite 8: Browser Compatibility 🌐

### Test 8.1: Chrome/Edge
- [ ] Test all core functionality
- [ ] **Expected:** ✅ Full support

### Test 8.2: Firefox
- [ ] Test all core functionality
- [ ] **Expected:** ✅ Full support

### Test 8.3: Safari
- [ ] Test all core functionality
- [ ] Check Visibility API support
- [ ] **Expected:** ✅ Full support

### Test 8.4: Older Browsers
- [ ] Test on browsers without Visibility API
- [ ] **Expected:** ⚠️ Fallback behavior (manual refresh)

---

## Automated Testing Checklist

### Unit Tests (Recommended)
- [ ] Test `toggleFavorite` function
- [ ] Test `handleVisibilityChange` function
- [ ] Test API route handlers
- [ ] Test error handling

### Integration Tests (Recommended)
- [ ] Test favorite flow end-to-end
- [ ] Test multi-tab synchronization
- [ ] Test authentication flow

### E2E Tests (Optional)
- [ ] Playwright/Cypress tests for user journeys
- [ ] Test across multiple browsers automatically

---

## Bug Reporting Template

If you find issues, report them with:

```markdown
### Bug Report

**Test:** [Test number and name]
**Date:** [Date tested]
**Browser:** [Browser name and version]
**Device:** [Desktop/Mobile/Tablet]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[If applicable]

**Console Errors:**
[Any errors from browser console]

**Network Tab:**
[Relevant API call failures]

**Priority:** [High/Medium/Low]
```

---

## Sign-Off Checklist

### Before Deployment
- [ ] All Test Suite 1 tests passed
- [ ] All Test Suite 2 tests passed
- [ ] All Test Suite 4 tests passed
- [ ] At least 80% of other tests passed
- [ ] No critical bugs found
- [ ] Performance acceptable (< 3s load time)
- [ ] No console errors in normal use

### Production Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track user engagement with favorites
- [ ] Watch for failed API calls

---

## Quick Test (5 Minutes)

If you only have 5 minutes, run these critical tests:

1. [ ] Browse page: Add favorite ← Most Critical
2. [ ] My Components: Verify it appears
3. [ ] Browse page: Remove favorite
4. [ ] My Components: Verify auto-refresh
5. [ ] No errors in console

---

## Testing Tools

### Required
- Modern browser (Chrome/Firefox/Safari)
- Browser DevTools
- User account with test data

### Optional
- Network throttling tools
- Mobile device or emulator
- Screen recording software
- Automated testing framework

---

## Test Results Summary

### Test Session Info
- **Tester Name:** _______________
- **Date:** _______________
- **Browser:** _______________
- **Version:** _______________

### Results
- **Total Tests:** _____ 
- **Passed:** _____ ✅
- **Failed:** _____ ❌
- **Skipped:** _____ ⏭️

### Severity Rating
- **Critical Issues:** _____ (Must fix before deploy)
- **Major Issues:** _____ (Should fix soon)
- **Minor Issues:** _____ (Can fix later)

### Sign-Off
- [ ] Ready for production deployment
- [ ] Needs minor fixes
- [ ] Needs major rework
- [ ] Not recommended for deployment

**Signed:** _______________ **Date:** _______________

---

**Testing Guide Created:** December 2024
**Estimated Testing Time:** 1-2 hours (full suite)
**Priority:** HIGH - Test before deploying to production
