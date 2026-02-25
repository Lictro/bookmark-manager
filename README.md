# 📌 Bookmark Manager

A modern, minimal bookmark manager built with **Next.js 16**, **Supabase**, and **Tailwind CSS**.

Designed as a personal knowledge hub with secure authentication, server-side protection, and a clean, accessible UI.

---

## Features

- Supabase Authentication (SSR + protected routes)
- Create, edit, archive and organize bookmarks
- Tagging system
- Search and sorting
- Dark / Light mode support
- Server-side session handling
- Fully responsive and accessible UI

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Auth & Database:** Supabase
- **Styling:** Tailwind CSS
- **UI Primitives:** Radix UI
- **Notifications:** Sonner
- **Date utilities:** date-fns
- **Icons:** Lucide

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager
```

### 2. Environment variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

Optional demo credentials (for local development only):

```env
NEXT_PUBLIC_DEMO_EMAIL=
NEXT_PUBLIC_DEMO_PASSWORD=
```

> ⚠️ **Never commit real secrets.**

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication & Route Protection

- Server-side route protection is handled via a Supabase SSR proxy.
- Users are redirected to `/login` if no session exists.
- Authenticated users are redirected away from `/login`.
- Logout triggers immediate client redirect for better UX.

---

## Project Structure (Simplified)

```
src/
 ├─ app/
 ├─ components/
 ├─ context/
 ├─ lib/
 │   └─ supabase/
 ├─ types/
 ├─ utils/
```

---

##  Future Improvements

- Folder/group organization
- Drag & drop ordering
- Bookmark preview metadata fetching
- Import/export functionality
- Unit & integration tests

---

##  Design Philosophy

The application prioritizes clarity, speed, and accessibility. Minimal UI. Zero clutter. Focused workflow.

---

##  License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.