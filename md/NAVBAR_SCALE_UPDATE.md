# Navbar Scale Update

## Overview
Updated navbar and dropdown components to match the scale of page content (max-w-7xl / 1280px).

## Changes Made

### 1. Dropdown Component (`frontend/components/ui/Dropdown.tsx`)
- Increased dropdown item text: `text-sm` → `text-base` (16px)
- Increased dropdown header text: `text-xs` → `text-sm`
- Increased badge text: `text-xs` → `text-sm`
- Increased badge padding: `px-2 py-0.5` → `px-2.5 py-1`

### 2. NotificationsDropdown (`frontend/components/layout/NotificationsDropdown.tsx`)
- Increased "Ver todas" icon: `w-4 h-4` → `w-5 h-5`
- Increased notification description text: `text-xs` → `text-sm`
- Increased notification time text: `text-xs` → `text-sm`
- Adjusted spacing: `mt-0.5` → `mt-1`, `mt-1` → `mt-1.5`
- Adjusted unread dot position: `mt-1.5` → `mt-2`

### 3. UserMenuDropdown (`frontend/components/layout/UserMenuDropdown.tsx`)
- Increased avatar size in header: `44px` → `48px`
- Increased user name text: `text-sm` → `text-base`
- Increased email text: `text-xs` → `text-sm`
- Increased XP bar text: `text-[10px]` → `text-xs`
- Increased XP bar height: `h-1` → `h-1.5`
- Increased all menu item icons: `w-4 h-4` → `w-5 h-5`

### 4. Header Component (Already Updated)
- Container: `max-w-[1400px]` → `max-w-7xl` (1280px)
- Logo size: `9x9` → `10x10`
- Logo icon: `20px` → `22px`
- Logo text: `base` → `lg`
- Nav links: `15px` → `base` (16px)
- Nav link padding: `px-3.5` → `px-4`
- Gap between elements: `gap-4` → `gap-6`
- Divider height: `h-5` → `h-6`

## Result
All navbar components now use consistent sizing that matches the page content scale:
- Base text size: 16px (text-base)
- Icons: 20-24px (w-5 h-5 to w-6 h-6)
- Container width: 1280px (max-w-7xl)
- Consistent spacing and padding throughout

## Files Modified
1. `frontend/components/ui/Dropdown.tsx`
2. `frontend/components/layout/NotificationsDropdown.tsx`
3. `frontend/components/layout/UserMenuDropdown.tsx`
4. `frontend/components/layout/Header.tsx` (previously updated)
