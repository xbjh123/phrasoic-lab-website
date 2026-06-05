# Phrasoic Lab — Post Management Skill

Use this skill when the user provides article content and wants to add it to their Phrasoic Lab blog.

## Post Metadata Schema

```ts
interface Post {
  slug: string;       // URL slug, lowercase-hyphenated, e.g. "my-article-title"
  title: string;      // Article title
  excerpt: string;    // 1-2 sentence summary, under 180 chars
  body: string;       // Full HTML body (<p>, <h2>, <em> tags only — no inline styles)
  date: string;       // "YYYY.MM.DD — HH:MM:SS" format
  cat: string;        // Category: SYSTEMS | THEORY | CULTURE | ENGINEERING | DESIGN
  tags: string[];     // Lowercase, 2-4 per post, e.g. ["architecture", "distributed"]
  min: string;        // Reading time in minutes (estimate: ~200 words/min)
  docId: string;      // "DOC-NNNN" — auto-assign next number
  image?: string;     // Cover image URL (optional, default provided)
  label?: string;     // Hero float label (EN), max 3 posts get unique labels
  labelZh?: string;   // Hero float label (ZH)
}
```

## Auto-Generation Rules

When user provides article content, generate metadata by applying these rules:

### Slug
- Convert title to lowercase, replace spaces/symbols with hyphens
- Remove stop words: the, a, an, on, in, of, is, for
- Max 4-5 words

### Date
- Use current date in format `YYYY.MM.DD — HH:MM:SS`

### Minutes (Reading Time)
- Count words in body, divide by 200, round up to nearest integer
- Default to "5" if unsure

### DocId
- Auto-increment: find highest existing DOC-NNNN, add 1
- Format: `DOC-${String(nextId).padStart(4, '0')}`

### Category
- Read the article title and first paragraph, map to category:
  - SYSTEM: distributed systems, infrastructure, databases, networking
  - THEORY: mathematics, formal verification, abstractions, principles
  - CULTURE: society, philosophy, human behavior, trends
  - ENGINEERING: practical implementations, tools, architecture
  - DESIGN: UI/UX, typography, visual, interaction design

### Tags
- Extract 2-4 key terms from the article (lowercase, kebab-case if multi-word)

### Label / LabelZh
- Only assign if position is one of first 3 posts
- Use these rotations: ["LATEST TRANSMISSION"/"最新传输", "INCOMING SIGNAL"/"传入信号", "NEW DECLASSIFIED"/"新解密档案"]

### Image
- If user provides one, use it (verify URL resolves)
- Otherwise omit — system uses default Unsplash abstract gradient

### Body Formatting
- Wrap paragraphs in `<p>...</p>`
- Subheadings use `<h2>...</h2>` (no h3/h4 — keep flat)
- Emphasis: `<em>...</em>` (never `<i>`)
- Never use inline styles, classes, or `<div>`
- Never use markdown — convert to HTML

## Where to Add

Add the new post object to `src/data/posts.ts` in the `POSTS[]` array:

```ts
export const POSTS: Post[] = [
  {
    slug: "my-new-article",
    title: "My New Article Title",
    excerpt: "A short, compelling one-sentence summary of the article.",
    body: `<p>First paragraph...</p>
<h2>Section Heading</h2>
<p>More content...</p>`,
    date: "2026.06.05 — 14:30:00",
    cat: "SYSTEMS",
    tags: ["tag1", "tag2"],
    min: "6",
    docId: "DOC-0005",
    label: "LATEST TRANSMISSION",
    labelZh: "最新传输",
  },
  // ... existing posts
];
```

Then run `npm run build` to regenerate the static site.

## When User Provides an Article

1. Read the article content
2. Generate all metadata following the rules above
3. Convert to proper HTML body format
4. Show the user a preview in this format:

```
---
slug: my-article
title: My Article
cat: SYSTEMS
date: 2026.06.05 — 14:30:00
min: 6
docId: DOC-0005
tags: [tag1, tag2]
image: (default)
---

[Full HTML body]
```

5. Wait for user confirmation
6. Insert into `src/data/posts.ts`
7. Build and verify
