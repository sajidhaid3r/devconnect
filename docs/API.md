# DevConnect API Reference

Base URL: `http://localhost:5000/api`
All responses use the consistent format: `{ "success": boolean, "data": T | null, "message": string }`
Auth: JWT stored in an httpOnly `token` cookie after login/register/GitHub callback.
Protected routes also accept `Authorization: Bearer <token>` for tooling like Postman.

**Security middleware** (applies to every request): `helmet` sets baseline security
headers; all `/api/*` routes are rate-limited to 300 requests/15min per IP, with a
stricter 20 requests/15min limit specifically on `/api/auth/login` and
`/api/auth/register` to blunt credential-stuffing/brute-force attempts. Requests are
logged via `morgan` (`dev` format locally, `combined` in production).

## Auth — `/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account. Body: `email, username, password, fullName` |
| POST | `/auth/login` | — | Body: `email, password` |
| POST | `/auth/logout` | — | Clears auth cookie |
| GET | `/auth/me` | required | Returns current user |
| GET | `/auth/github` | — | Redirects to GitHub OAuth consent screen |
| GET | `/auth/github/callback` | — | GitHub redirects here; issues JWT, redirects to `/dashboard` |

## Users & Profiles — `/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/search?skill=&location=&page=&limit=` | — | Paginated developer search |
| GET | `/users/:username` | — | Public profile incl. skills, projects, published posts |
| PATCH | `/users/me` | required | Update `fullName, bio, location, githubUrl, linkedinUrl, websiteUrl, skills[]` |
| POST | `/users/me/avatar` | required | Multipart `avatar` file → Cloudinary upload |

## Projects — `/projects`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/projects/user/:username` | — | List a user's projects |
| POST | `/projects` | required | Multipart form: `title, description, techStack[], repoUrl, liveUrl, image` |
| PATCH | `/projects/:id` | required (owner) | Update a project |
| DELETE | `/projects/:id` | required (owner) | Delete a project |

## Blog — `/blog`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/blog?page=&limit=` | — | Paginated published posts |
| GET | `/blog/:slug` | — | Single post |
| POST | `/blog` | required | Body: `title, contentMarkdown, excerpt?, coverImageUrl?, published?` |
| PATCH | `/blog/:id` | required (author) | Update a post |
| DELETE | `/blog/:id` | required (author) | Delete a post |

## Connections — `/connections`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/connections` | required | List accepted connections |
| GET | `/connections/pending` | required | Incoming pending requests |
| GET | `/connections/mutual/:username` | required | Connections shared between you and `:username` |
| POST | `/connections` | required | Body: `addresseeUsername` — send a request |
| PATCH | `/connections/:id/respond` | required | Body: `action: "ACCEPT" \| "REJECT"` |
| DELETE | `/connections/:id` | required | Remove a connection |

## Skills & Endorsements — `/skills`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/skills/top/:username` | — | Skills ranked by endorsement count |
| POST | `/skills/endorse` | required | Body: `toUsername, skillName` (must be connected first) |

## Notifications — `/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | required | Last 50 notifications |
| PATCH | `/notifications/:id/read` | required | Mark one as read |

## Dashboard — `/dashboard`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | required | Stats, pending requests, trending posts, connection suggestions |

## Real-time events (Socket.io)
Client connects with `auth: { token }`. Server emits `notification` events with
payloads `{ type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT", ... }`
directly to the relevant user's active sockets.
