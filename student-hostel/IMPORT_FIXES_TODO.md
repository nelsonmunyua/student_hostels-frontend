# Import Fixes TODO

## Current Issues
1. authThunks import path is wrong in 3 Sidebar files
2. Host sidebar has multiple issues (imports and filename case)

## Fix Plan

### Step 1: Fix student Sidebar.jsx authThunks import
- [x] Change from `../../redux/thunks/authThunks` to `../../../../redux/slices/Thunks/authThunks`

### Step 2: Fix admin Sidebar.jsx authThunks import
- [x] Change from `../../redux/thunks/authThunks` to `../../../../redux/slices/Thunks/authThunks`

### Step 3: Fix host sidebar.jsx
- [x] Fix Header import: `./components/Header` → `./Header`
- [x] Fix Sidebar import: `./components/Sidebar` → `./Sidebar`
- [x] Fix authThunks import to correct path
- [x] Rename file: `sidebar.jsx` → `Sidebar.jsx`

### Step 4: Verify fixes
- [x] Run `npm run dev` to confirm all import errors are resolved

## File Locations
- `src/components/Dashboard/student/components/Sidebar.jsx`
- `src/components/Dashboard/admin/components/Sidebar.jsx`
- `src/components/Dashboard/host/components/sidebar.jsx` → `Sidebar.jsx`

