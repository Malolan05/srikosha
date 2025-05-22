# Detailed Explanation of the `Malolan05/srikosha` Repository

## Overview

**Śrīkoṣa** is a web application designed for the exploration and study of the sacred texts of the Śrī Vaiṣṇava Sampradāya, a tradition within Hinduism. The core goal of the project is to provide a modern, user-friendly interface for browsing, reading, and engaging with a curated collection of scriptures and related resources.

---

## Key Features

- **Category Grid:** Users can quickly browse scriptures by thematic or traditional categories.
- **Responsive UI:** The website is fully optimized for use on all device sizes (desktop, tablet, mobile).
- **Modern Web Stack:** The app is built using Next.js (React-based framework), TypeScript, Tailwind CSS for styling, and uses Radix UI components for accessible and customizable UI elements.
- **Scripture Navigation:** Users can read scriptures, navigate between verses, and access various translations, transliterations, and traditional commentaries.

---

## Tech Stack

- **Framework:** Next.js 13
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Utilities/Helpers:** `clsx`, `class-variance-authority`

---

## Project Structure

- `app/` – Main application pages and logic.
- `components/` – Reusable UI components (e.g., scripture display, verse detail, navigation, etc.).
- `data/` – Data files, including scripture metadata and actual scripture content (usually in JSON format).
- `public/` – Static assets (images, icons, etc.).
- `styles/` – Global CSS and Tailwind configuration.

---

## How It Works (Functional Details)

### 1. **Scripture Data Management**

- **Scripture Data:** The core scripture data is stored as JSON files in the `data/scriptures` directory.
- **Data Interfaces:** The TypeScript interfaces (`lib/types.ts`) define the structure of scripture data, including metadata (name, author, category, language, script, number of verses/chapters, etc.), verses, sections, and commentaries.
- **APIs:** Next.js API routes (e.g., `app/api/scriptures/route.ts` and `app/api/scriptures/[slug]/route.ts`) allow the frontend to fetch all scriptures or a specific scripture by its slug.

### 2. **Frontend Application**

- **Homepage & Navigation:** Users begin at a homepage, where they can browse scriptures by category.
- **Scripture Pages:** Upon selecting a scripture, users are shown a detailed view with metadata and hierarchical navigation for chapters and verses.
- **Verse Detail:** Users can navigate verse-by-verse, viewing:
    - The original text (often in Sanskrit, Tamil, or another Indic script).
    - IAST transliteration.
    - English translation.
    - Traditional commentaries (multiple per verse, attributed to different scholars).

- **Tabs for Viewing Modes:** The verse detail view supports tabs for switching between the original, transliteration, and translation.

### 3. **Component Logic**

- **Verse Navigation:** Components like `verse-detail-wrapper.tsx` and `verse-detail.tsx` manage navigation between verses, sync the selected view/tab with the URL and local storage, and provide contextual information (like section and verse numbers).
- **Reusable UI:** The project leverages reusable UI primitives from Radix UI and custom components for cards, tabs, selects, and scroll areas.
- **Script Recognition:** Utility functions analyze verse text to determine the script (Devanagari, Tamil, Latin, etc.) for appropriate font/rendering.

### 4. **Developer Experience**

- **Auto-update:** Editing the homepage or scripture display logic (e.g., `app/page.tsx`) hot-reloads the app for rapid UI development.
- **Scripts:** Standard npm/yarn scripts for running the development server, building for production, and linting.

---

## Example Data Model

A scripture is modeled as:

```typescript
interface ScriptureMetadata {
  slug: string;
  scripture_name: string;
  category: string;
  author: string;
  language: string;
  script: string;
  total_verses: number;
}

interface Verse {
  original_text: string;
  iast_text: string;
  english_translation: string;
  commentaries: Record<string, string>;
}

interface Section {
  title: string;
  verses?: Verse[];
  sections?: Section[];
}

interface Scripture {
  metadata: ScriptureMetadata;
  content: {
    sections: Section[];
  };
}
```

---

## Summary

- **Śrīkoṣa** is a specialized scripture explorer for Śrī Vaiṣṇava texts, with a strong focus on accessibility, clarity, and modern design.
- The architecture is built for efficient scripture data access, with rich verse-level navigation and commentary features.
- The project is private and not licensed for distribution.

---

**If you have more specific questions about any part of the codebase or functionality, let me know!**
