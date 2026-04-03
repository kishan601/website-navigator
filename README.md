# Website Navigator

Welcome to **Website Navigator** — a full-stack web app that takes a spreadsheet full of URLs and turns it into a “click next, see next” browsing cockpit.

Think of it as:
- Google Sheets meets remote control
- Excel meets browser tabs
- “I have 80 links” meets “I value my sanity”

<img width="1919" height="922" alt="image" src="https://github.com/user-attachments/assets/2e5e36ea-e719-4b21-8178-8baebe673222" />
---

## What This Project Actually Does

You upload an **Excel** or **CSV** file containing URLs.

The app:
- Extracts valid website links
- Cleans obvious URL formatting issues
- Displays websites inside the app
- Lets you navigate with **Previous** / **Next** buttons
- Handles iframe-blocked sites gracefully with an **Open in new tab** fallback

In short: fewer tabs, less chaos, more control.
<img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/43fc0683-41af-4bd9-8eed-732178695104" />
---

## Why This Exists

Because opening links from spreadsheets one by one is:
- repetitive
- soul-draining
- suspiciously similar to punishment

This project automates that workflow while keeping the UI clean and responsive.

---

## Tech Stack

### Frontend
- React (Vite)
- Axios
- Tailwind CSS (via `@tailwindcss/vite`)
- Lucide React icons

### Backend
- Node.js
- Express
- Multer (file upload handling)
- xlsx (Excel/CSV parsing)

---

## Project Structure

```text
Website-Navigator/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   │   ├── iframeController.js
│   │   │   └── uploadController.js
│   │   ├── routes/
│   │   │   └── apiRoutes.js
│   │   ├── services/
│   │   │   ├── iframeService.js
│   │   │   └── urlExtractionService.js
│   │   └── utils/
│   │       └── urlUtils.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.jsx
│   │   │   ├── ErrorAlert.jsx
│   │   │   ├── UploadSection.jsx
│   │   │   └── WebsiteViewer.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
└── test.csv
```

---

## Features

### 1) Spreadsheet Upload
- Accepts `.xlsx`, `.xls`, `.csv`
- Uploads file to backend via `multipart/form-data`

### 2) URL Extraction
- Scans all rows/cells
- Accepts `http://` and `https://`
- Attempts domain normalization (e.g. `example.com` becomes `https://example.com`)
- De-duplicates URLs

### 3) In-App Website Display
- Uses iframe for embeddable websites
- Shows current URL and index counter (`3 of 12`)

### 4) Smart Navigation
- Previous/Next buttons
- Disabled states at bounds
- Smooth flow for sequential browsing

### 5) Security-Aware Fallback
- Backend checks headers (`X-Frame-Options`, `Content-Security-Policy`)
- If blocked, frontend shows:
  - clear message
  - **Open in new tab** action

No dark magic, no policy bypassing, no browser tantrums.
<img width="1918" height="934" alt="image" src="https://github.com/user-attachments/assets/738e64f8-21f2-4c66-aaef-2cf73f83f42a" />
<img width="1915" height="936" alt="image" src="https://github.com/user-attachments/assets/ff70d147-64fe-4fa6-8285-d057ea0ea83a" />

---

## iframe Blocking: The Real Talk

Some websites refuse to be embedded by design.

Common reasons:
- `X-Frame-Options: SAMEORIGIN`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: frame-ancestors ...`

This is expected behavior and a security feature, not a bug in your app.

Examples that commonly block framing:
- Google
- GitHub
- YouTube Music
- many major SaaS platforms

So if a site won’t load in iframe, the app falls back to opening it in a new tab.

---

## API Endpoints

### `POST /api/upload`
Parses uploaded spreadsheet and returns extracted URLs.

**Request**
- FormData with key: `file`

**Response (success)**
```json
{
  "urls": [
    "https://react.dev",
    "https://nodejs.org"
  ]
}
```

### `POST /api/check-iframe`
Checks if a URL can be embedded.

**Request body**
```json
{
  "url": "https://example.com"
}
```

**Response**
```json
{
  "canEmbed": true
}
```

---

## Setup Instructions

## 1) Clone / Open project

```bash
cd Website-Navigator
```

## 2) Backend setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:
- `http://localhost:5000`

## 3) Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

---

## How to Use

1. Start backend and frontend
2. Open frontend in browser
3. Upload Excel/CSV file with URLs
4. Click **Start Navigating**
5. Use **Previous** / **Next**
6. If blocked by security headers, click **Open in new tab**

---

## Sample CSV Format

```csv
website,notes
https://render.com,may block iframe
https://music.youtube.com,may block iframe
https://react.dev,usually embeddable
https://nodejs.org,usually embeddable
invalid-url,ignored
```

---

## UX Notes

- File upload button shows selected file name
- Loading state appears while processing uploads
- Compatibility check appears before rendering iframe
- URL bar in navigation header links to the current website

---

## Error Handling

The app handles:
- Missing file upload
- Invalid spreadsheet content
- Empty URL extraction results
- URL check failures
- Non-embeddable websites

And does so without yelling at users in developer jargon.

---

## Common Issues

### “Service unavailable”
- Ensure backend is running on port `5000`
- Ensure frontend points to `http://localhost:5000`

### “Refused to display ... in a frame”
- Normal behavior for blocked websites
- Use **Open in new tab**

### Uploaded file returns no URLs
- Verify file includes valid links
- Prefer full URLs with protocol (`https://`)

---

## Security Notes

- The app respects target-site embedding policies
- No bypass attempts for `X-Frame-Options` / CSP
- No secret keys stored in frontend
- Environment files are excluded via `.gitignore`

---

## Scripts

### Backend
- `node server.js` — starts API server

### Frontend
- `npm run dev` — starts Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

---

## Roadmap Ideas

- Drag-and-drop file upload
- Multiple sheet selection
- URL validation report before navigation
- Search/filter URL list
- Bookmark favorites inside session
- “Skip blocked websites” toggle

---

## Assignment Fit Checklist

- Upload Excel / CSV file ✅
- Extract website URLs ✅
- Display websites in app ✅
- Navigate via Previous / Next ✅
- Smooth and responsive UI ✅
- React frontend + Node/Express backend ✅

---

## Submission Assets

### Screenshots
- `screenshots/01-upload-screen.png` (upload state)
- `screenshots/02-viewer-desktop.png` (viewer with URL bar + bottom navigation)
- `screenshots/03-viewer-mobile.png` (responsive mobile layout)
- `screenshots/04-blocked-site-fallback.png` (Open in new tab fallback)

### Demo Video
- `demo/website-navigator-demo.mp4`
- Suggested flow:
  - Upload sample file
  - Move across links using bottom Previous/Next buttons
  - Show responsive behavior on narrow viewport
  - Show blocked iframe case and Open in new tab action

---

## Final Note

If your spreadsheet has 200 links and your patience has 3, this app was built for you.

Happy navigating.
