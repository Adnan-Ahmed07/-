# Render Deployment Guide

## Render Dashboard Settings

Render.com dashboard-এ এই settings গুলো ঠিক করুন:

### 1. Root Directory
- **Current (Wrong):** `src`
- **Should be:** খালি রাখুন (empty) অথবা `.` রাখুন
- **Edit করুন** এবং field টি খালি করুন

### 2. Build Command
- **Current (Wrong):** `src/ $ npm install; npm run build`
- **Should be:** `npm install && npm run build`
- **Edit করুন** এবং `npm install && npm run build` লিখুন

### 3. Publish Directory
- **Current (Wrong):** `src/ dist`
- **Should be:** `dist`
- **Edit করুন** এবং শুধু `dist` লিখুন

## Step by Step Instructions

1. Render.com dashboard-এ আপনার service-এ যান
2. Settings tab-এ ক্লিক করুন
3. **Root Directory** section-এ:
   - "Edit" button-এ ক্লিক করুন
   - Field টি খালি করুন (empty)
   - Save করুন

4. **Build Command** section-এ:
   - "Edit" button-এ ক্লিক করুন
   - `npm install && npm run build` লিখুন
   - Save করুন

5. **Publish Directory** section-এ:
   - "Edit" button-এ ক্লিক করুন
   - শুধু `dist` লিখুন (src/ dist নয়)
   - Save করুন

6. Manual Deploy করুন অথবা নতুন commit push করুন

## Why These Settings?

- **Root Directory:** Project root-এ `package.json` এবং `vite.config.js` আছে, তাই root directory খালি রাখতে হবে
- **Build Command:** Root directory থেকে build command run করতে হবে
- **Publish Directory:** `dist` folder root-এ তৈরি হয়, `src/` folder-এ নয়

