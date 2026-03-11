# short.ly

A fast, modern URL shortener built with React and Supabase. Create short links, track clicks in real time, and analyze your audience — all from a clean, responsive dashboard.

---

## Features

- **URL Shortening** — Generate short links instantly with configurable expiry (24h, 7 days, 30 days, or permanent)
- **Click Tracking** — Every redirect is tracked with device type, country, and referrer
- **Analytics Dashboard** — Visualize clicks over time, device breakdown, and top countries
- **Authentication** — Email/password and Google OAuth sign-in via Supabase Auth
- **Link Management** — Search, copy, preview QR codes, and delete links from one place
- **Dark Mode** — Full dark/light theme support
- **Geo Detection** — Country detection on every click via IP lookup

---

## Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React 18 + Vite     |
| Backend     | Supabase (Postgres) |
| Auth        | Supabase Auth       |
| Deployment  | Vercel              |
| Styling     | Inline styles + CSS |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Vercel account (for deployment)

### Installation

```bash
git clone https://github.com/anshulyadavv/url_shortner.git
cd url_shortner
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
create table links (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  original_url text not null,
  user_id uuid references auth.users(id) null,
  is_temporary boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade,
  clicked_at timestamptz default now(),
  country text,
  device text,
  referrer text
);
```

Then enable Row Level Security and add the following policies on the `links` table:

- **Anyone can read links by slug** — `SELECT`, `using(true)`
- **Users can insert their own links** — `INSERT`, authenticated
- **Users can view their own links** — `SELECT`, `using(auth.uid() = user_id)`

### Running Locally

```bash
npm run dev
```

---

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel → Settings → Environment Variables
3. Add a `vercel.json` to the project root for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

4. Set your production branch in Vercel → Settings → General → Production Branch

---

## Project Structure

```
src/
├── components/
│   ├── Charts.jsx        # Sparkline, BarChart, DonutChart, RollingNumber
│   ├── DashboardLayout.jsx
│   └── UI.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── data/
│   └── icons.js
├── lib/
│   ├── redirect.js       # Handles short link redirects before app renders
│   └── supabase.js
├── pages/
│   ├── AuthPages.jsx
│   ├── DashboardTabs.jsx
│   ├── GeneratedPage.jsx
│   └── LandingPage.jsx
├── App.jsx
└── main.jsx
```

---

## How Redirects Work

Short link redirects are handled in `src/lib/redirect.js` before the React app mounts. When a user visits a short URL:

1. The slug is extracted from the path
2. Supabase is queried for the matching link
3. Expiry is checked — expired links redirect to home
4. A click is recorded with device, referrer, and country data
5. The user is redirected to the original URL

This approach ensures redirects are fast and don't require the full React app to load first.

---

## License

MIT
