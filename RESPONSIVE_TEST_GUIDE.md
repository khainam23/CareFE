# Responsive Design Testing Guide

## Quick Testing Instructions

### Using Browser DevTools

1. **Open the Support Interface**
   ```bash
   npm run dev
   ```
   Navigate to: `http://localhost:5173/support/dashboard`

2. **Open Browser DevTools**
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

3. **Enable Responsive Design Mode**
   - Chrome/Edge: Click the device toolbar icon or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
   - Firefox: Click the responsive design mode icon or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)

### Test Scenarios

#### 1. Mobile View (375px - iPhone SE)
**Expected Behavior:**
- ✅ Sidebar hidden by default
- ✅ Hamburger menu button visible in header
- ✅ Statistics cards stack vertically (1 column)
- ✅ Ticket lists show card view (not table)
- ✅ All text readable and properly sized
- ✅ Buttons full width
- ✅ Modal takes full width with padding

**Test Steps:**
1. Set viewport to 375px width
2. Click hamburger menu - sidebar should slide in from left
3. Click overlay or X button - sidebar should close
4. Navigate to "All Tickets" - should see card view
5. Click a ticket - detail page should be readable
6. Try "Resolve Ticket" - modal should be mobile-friendly

#### 2. Tablet View (768px - iPad)
**Expected Behavior:**
- ✅ Sidebar still collapsible with toggle
- ✅ Statistics cards in 2 columns
- ✅ Filters in 2-column layout
- ✅ Tables may show or cards depending on content
- ✅ Modal centered with proper width

**Test Steps:**
1. Set viewport to 768px width
2. Test sidebar toggle functionality
3. Check dashboard - stats should be in 2 columns
4. Navigate to tickets - check layout adapts properly
5. Test filters - should be in 2-column grid

#### 3. Desktop View (1024px+)
**Expected Behavior:**
- ✅ Sidebar always visible on left
- ✅ No hamburger menu button
- ✅ Statistics cards in 4 columns
- ✅ Full table views for tickets
- ✅ All columns visible
- ✅ Optimal spacing and layout

**Test Steps:**
1. Set viewport to 1024px or wider
2. Sidebar should be permanently visible
3. Dashboard stats in 4-column grid
4. Ticket lists show full table with all columns
5. All features easily accessible

### Specific Pages to Test

#### Dashboard (`/support/dashboard`)
- [ ] Statistics cards responsive grid
- [ ] Quick action buttons layout
- [ ] Distribution charts stack on mobile

#### All Tickets (`/support/tickets`)
- [ ] Filters adapt to screen size
- [ ] Table view on desktop
- [ ] Card view on mobile
- [ ] Search input full width on mobile

#### Ticket Detail (`/support/tickets/:id`)
- [ ] Header layout adapts
- [ ] Sidebar stacks below on mobile
- [ ] Action buttons full width on mobile
- [ ] Customer info readable

#### Unassigned Tickets (`/support/unassigned`)
- [ ] Count badge positioning
- [ ] Cards grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] "Assign to Me" buttons accessible

#### My Tickets (`/support/my-tickets`)
- [ ] Status filter layout
- [ ] Quick stats always 3 columns
- [ ] Table/card view switching
- [ ] Urgent tickets highlighted

### Common Responsive Patterns to Verify

1. **Sidebar Behavior**
   - Mobile: Hidden, slides in with overlay
   - Desktop: Always visible, no overlay

2. **Typography Scaling**
   - Headings: Smaller on mobile, larger on desktop
   - Body text: Readable at all sizes

3. **Grid Layouts**
   - Mobile: 1 column
   - Tablet: 2 columns
   - Desktop: 3-4 columns

4. **Tables vs Cards**
   - Mobile/Tablet: Card view
   - Desktop: Table view

5. **Buttons**
   - Mobile: Full width
   - Desktop: Auto width

6. **Modals**
   - Mobile: Full width with padding
   - Desktop: Max width centered

### Browser Testing

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Orientation Testing

For mobile/tablet:
- [ ] Portrait orientation
- [ ] Landscape orientation

### Touch Testing

On actual mobile devices:
- [ ] Tap targets are easy to hit (minimum 44x44px)
- [ ] Swipe gestures don't interfere
- [ ] Scrolling is smooth
- [ ] No horizontal scroll

### Performance Testing

- [ ] No layout shifts during resize
- [ ] Smooth transitions
- [ ] Fast rendering at all sizes

## Automated Testing (Optional)

You can use browser automation tools to test responsive design:

```javascript
// Example with Playwright
const { test, expect } = require('@playwright/test');

test('mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/support/dashboard');
  
  // Sidebar should be hidden
  const sidebar = page.locator('aside');
  await expect(sidebar).toHaveClass(/translate-x-full/);
  
  // Menu button should be visible
  const menuButton = page.locator('button:has-text("Menu")');
  await expect(menuButton).toBeVisible();
});
```

## Troubleshooting

### Issue: Sidebar not closing on mobile
**Solution**: Check that overlay click handler is working and z-index is correct

### Issue: Text too small on mobile
**Solution**: Verify responsive text classes (text-xs sm:text-sm)

### Issue: Horizontal scroll on mobile
**Solution**: Check for fixed widths, use max-w-full or w-full

### Issue: Touch targets too small
**Solution**: Ensure minimum 44x44px size with proper padding

### Issue: Modal not centered
**Solution**: Check flex centering classes and padding

## Success Criteria

✅ All pages render correctly at 375px, 768px, and 1024px
✅ Sidebar toggle works on mobile/tablet
✅ No horizontal scroll at any breakpoint
✅ All text is readable
✅ All interactive elements are accessible
✅ Touch targets meet minimum size
✅ Smooth transitions and animations
✅ No layout shifts during resize

## Notes

- The responsive design uses Tailwind CSS utility classes
- No custom media queries needed
- All breakpoints follow Tailwind defaults
- Mobile-first approach used throughout
- CSS-only responsive behavior (no JavaScript)
