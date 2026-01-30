

# Coming Soon Landing Page with Waitlist

## Overview

This plan creates a beautiful "Coming Soon" landing page that:
- Preserves the current homepage code for easy restoration later
- Displays "New and Improved Version of MasterGrowbot AI Coming Soon! Stay Tuned!"
- Includes a waitlist signup form (name + email)
- Maintains brand consistency with existing design (colors, fonts, sparkles effect)
- Stores waitlist signups in Supabase for you to access later

---

## What You'll See

The new landing page will feature:
- The MasterGrowbot logo with the glowing effect
- "Coming Soon" headline in the signature gradient style
- A brief message about the new version
- A simple waitlist form (name and email fields)
- Success confirmation when users sign up
- Links to Privacy Policy and Terms of Service
- Same sparkle particle effects and dark theme

---

## Implementation Steps

### Step 1: Backup Current Homepage

Create a copy of the current Index.tsx as `IndexBackup.tsx` so you can easily restore it later when ready to relaunch.

### Step 2: Create Waitlist Database Table

Add a new `waitlist` table in Supabase with columns:
- `id` (auto-generated)
- `name` (text)
- `email` (text, unique)
- `created_at` (timestamp)

This will store all signups for you to export later.

### Step 3: Create Coming Soon Page Component

Build a new `ComingSoon.tsx` component featuring:

**Visual Elements:**
- Same sparkle background effect
- MasterGrowbot logo with glow animation
- Gradient headline: "Master Growbot"
- Subheadline: "New and Improved Version Coming Soon!"
- Tagline about award-winning AI cannabis cultivation

**Waitlist Form:**
- Name input field
- Email input field
- "Join the Waitlist" button with hover effects
- Form validation (required fields, email format)
- Success toast notification on signup

**Footer:**
- Links to Privacy Policy and Terms of Service

### Step 4: Update Index.tsx

Replace the current homepage content with the Coming Soon page while keeping the infrastructure (routing, auth context) intact.

### Step 5: Keep Existing Routes Working

Protected routes (/chat, /plant-health, /grow-guide) remain in place so any existing users with active sessions can still access the app. This prevents disruption for current users.

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/pages/IndexBackup.tsx` | Backup of current homepage |
| CREATE | `src/pages/ComingSoon.tsx` | New Coming Soon landing page |
| UPDATE | `src/pages/Index.tsx` | Show Coming Soon page instead |
| UPDATE | `src/integrations/supabase/types.ts` | Add waitlist table type |

---

## Database Changes

A new table will be created in your Supabase database:

```
Table: waitlist
- id: uuid (primary key, auto-generated)
- name: text (required)
- email: text (required, unique)
- created_at: timestamp (auto-generated)
```

Row-Level Security (RLS) will allow anyone to insert (public signup) but only authenticated admins to read the data.

---

## How to Access Waitlist Signups

After implementation, you can view your waitlist signups by:
1. Going to the Lovable Cloud panel
2. Clicking on Database > Tables > waitlist
3. Export the data as CSV when ready

---

## Restoration Process

When you're ready to relaunch the full app:
1. Copy the content from `IndexBackup.tsx` back to `Index.tsx`
2. Or simply delete `IndexBackup.tsx` if you've already made changes and no longer need it

---

## Technical Details

### Colors Used (Brand Consistent)
- Background: `#0F1117` (dark theme)
- Primary Green: `#2D5A27` / `#4AE54A` (glow)
- Accent Purple: `#B24BF3`
- Gold: `#FFD700`
- Card Background: `#1A1E26`

### Fonts
- Headlines: Orbitron (tech-font)
- Body: Space Grotesk

### Form Validation
- Name: Required, max 100 characters
- Email: Required, valid email format, max 255 characters
- Duplicate email handling with friendly error message

### Security
- Input sanitization before database insert
- RLS policies prevent unauthorized data access
- No sensitive data exposed in the form

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Losing current homepage | Creating IndexBackup.tsx |
| Breaking existing users | Protected routes still work |
| Form spam | Rate limiting via Supabase |
| Email duplicates | Unique constraint + friendly error |

