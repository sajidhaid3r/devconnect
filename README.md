# DevConnect — Developer Networking & Portfolio Platform

Internship final project (Code A Nova, Full Stack Development track). A full-stack
platform where developers create profiles, showcase projects, write technical blog
posts, connect with each other, and endorse skills.

**Stack:** React 18 + Vite + Tailwind · Node.js + Express + TypeScript · PostgreSQL + Prisma ·
JWT + GitHub OAuth 2.0 · Cloudinary · Socket.io · React Query + Zustand.

---

## 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL installed locally (you said this is already done — just need the password you set during install)
- A free [Cloudinary](https://cloudinary.com/) account (for image uploads)
- A [GitHub OAuth App](https://github.com/settings/developers) (for GitHub login) — optional to get the rest running

## 2. Create the database

Open a terminal and log into `psql` with the postgres user/password you set during install:

```bash
psql -U postgres
```

Then inside the `psql` prompt:

```sql
CREATE DATABASE devconnect;
\q
```

## 3. Install dependencies

From the project root:

```bash
npm install
npm install --workspace=server
npm install --workspace=client
```

## 4. Configure environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in real values:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/devconnect"
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

Replace `YOUR_PASSWORD` with the actual PostgreSQL password you set. Generate a
`JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Where to get the other values:**
- **GitHub OAuth**: github.com/settings/developers → "New OAuth App" → Homepage URL
  `http://localhost:5173`, Callback URL `http://localhost:5000/api/auth/github/callback`.
  Copy the generated Client ID and (after clicking "Generate a new client secret") the secret.
- **Cloudinary**: cloudinary.com → sign up free → Dashboard shows Cloud name, API Key,
  API Secret directly.

If you don't want to set up GitHub OAuth right now, that's fine — email/password
login works without it; the "Continue with GitHub" button just won't succeed until
those three variables are filled in.

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

No changes needed here for local development.

## 5. Run database migrations & seed data

```bash
cd server
npx prisma migrate dev --name init
npm run db:seed
cd ..
```

This creates all tables from `prisma/schema.prisma` and inserts two demo users
(`alice@example.com` / `bob@example.com`, password `password123`) with sample
projects and a blog post, so the demo isn't starting from an empty database.

## 6. Run the app

From the project root:

```bash
npm run dev
```

This starts the API on `http://localhost:5000` and the frontend on
`http://localhost:5173` at the same time (via `concurrently`). Open the frontend
URL in your browser.

To run them separately instead:

```bash
npm run dev:server   # API only
npm run dev:client   # frontend only
```

## 7. Run tests

```bash
npm run test
```

Runs the Jest suite (backend: response-shape and slug-generation tests) and the
Vitest suite (frontend: slug-format sanity check) — see `docs/API.md` for the
full endpoint list these exercises are built against.

## 8. Useful commands

| Command | What it does |
|---|---|
| `npm run db:studio` (from `server/`) | Opens Prisma Studio — a GUI to browse/edit your database |
| `npx prisma migrate dev --name <change>` | Create a new migration after editing `schema.prisma` |
| `npm run build` | Builds both server and client for production |

## 9. Project structure

```
devconnect/
├── client/          React + Vite + Tailwind frontend
├── server/          Express + TypeScript + Prisma API
├── shared/types/     Shared TypeScript types (used by both, per brief's monorepo requirement)
└── docs/            API reference, schema diagram, user flow diagrams
```

## 10. Deployment (per brief: Frontend → Vercel, Backend → Railway, DB → Neon)

1. **Database**: create a free project at [neon.tech](https://neon.tech), copy its
   connection string into `DATABASE_URL` on your backend host.
2. **Backend**: push `server/` to GitHub, connect the repo on [railway.app](https://railway.app),
   set the same env vars as your local `.env` (with the Neon `DATABASE_URL`),
   set `CLIENT_ORIGIN` to your deployed frontend URL.
3. **Frontend**: connect the repo on [vercel.com](https://vercel.com), set root
   directory to `client/`, set `VITE_API_BASE_URL`/`VITE_SOCKET_URL` to your
   Railway backend URL.
4. Update the GitHub OAuth App's callback URL to the deployed backend URL once live.

## 11. What's implemented vs. what to extend

Fully working: registration/login, JWT auth via httpOnly cookie, GitHub OAuth,
profile view/edit + avatar upload, project CRUD with Cloudinary image upload,
blog CRUD with Markdown rendering, developer search/filter with pagination,
connection request/accept/reject/remove + mutual connections, skill endorsements
(restricted to connections), real-time Socket.io notifications, dashboard with
stats/suggestions/trending posts, consistent `{success, data, message}` API
responses, security middleware (helmet, tiered rate limiting, request logging),
Jest (backend, including mocked-Prisma unit tests for auth and connection logic)
+ Vitest (frontend) tests.

Scaffolded but intentionally left for you to extend (so there's real work you can
speak to in the demo — see `docs/PRESENTATION_NOTES.md`): mobile navigation
polish, activity-feed granularity beyond trending posts, and richer skill
autocomplete on the profile editor. These are called out so you can decide how
much further to take them before the 23rd.
