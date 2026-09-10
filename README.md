# subhojit-portfolio-api

Backend for Subhojit's portfolio — **Express + MongoDB (Mongoose) + Cloudinary**. Every
section of the portfolio (hero, stats, companies, tech stack, experience, projects,
skills, process, resume, contact, social links, footer) is its own resource with full
CRUD. Content reads are public (the portfolio site fetches without logging in); every
write is JWT-protected (only the admin dashboard can mutate data).

## Stack

Node.js (ESM) · Express 5 · Mongoose 9 · Cloudinary (image/PDF uploads) · JWT + bcrypt
(single-admin auth) · helmet, cors, express-rate-limit, express-validator.

Express 5 forwards rejected promises from async handlers to the error middleware
automatically, so controllers stay plain `async (req, res) => {...}` — no try/catch or
`asyncHandler` boilerplate anywhere.

## Setup

```bash
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD
npm install
npm run seed:admin        # creates the one admin user from .env
npm run seed:content      # loads the current portfolio content as a starting point
npm run dev                # http://localhost:5000
```

`CLOUDINARY_*` can stay blank for now — every upload route returns a clear `503` until
they're filled in; nothing else breaks. Fill them in later and uploads start working
immediately, no code changes needed.

`npm run test:smoke` boots the real app against an in-memory MongoDB and drives 25
assertions over real HTTP (auth, public reads, protected writes, subdocument CRUD,
validation, and every error-mapping branch) — a good sanity check after any change.

## Data model

Two shapes repeat across every resource:

- **Singleton section** (`Profile`, `Resume`, `ContactSection`, `FooterSection`,
  `SocialLinks`, `Settings`, and the `*Section` wrapper docs) — exactly one document,
  holding a section's text/config. `GET` auto-creates it with defaults on first read;
  `PUT` upserts.
- **Top-level collection** (`Company`, `Experience`, `Project`) — independent entities
  the admin adds/removes one at a time. Standard REST five: list, get one, create,
  update, delete.

A third shape, **subdocument arrays** (`StatsSection.items`, `TechStackSection.cards`,
`SkillsSection.columns`, `ProcessSection.phases`, `SocialLinks.primary`/`footer`,
`FooterSection.jumps`), lives nested inside a singleton and gets its own item-level
CRUD (`POST` add, `PUT`/`DELETE :itemId`, plus `PUT .../reorder`).

All three shapes are implemented once as factories (`src/utils/{crudFactory,
singletonFactory,arrayItemFactory}.js`) and reused — no per-resource controller
reinvents create/read/update/delete.

## API reference

Base URL: `/api`. 🔒 = requires `Authorization: Bearer <token>` or the admin session
cookie. Everything else is public.

| Resource | Routes |
| --- | --- |
| **Auth** | `POST /auth/login` · `POST /auth/logout` · `GET /auth/me` 🔒 |
| **Aggregate** | `GET /portfolio` — everything below, in one response |
| **Profile** (hero) | `GET /profile` · `PUT /profile` 🔒 · `PUT /profile/avatar` 🔒 (multipart `image`) |
| **Stats** | `GET /stats` · `PUT /stats` 🔒 · `POST /stats/items` 🔒 · `PUT/DELETE /stats/items/:id` 🔒 · `PUT /stats/items/reorder` 🔒 |
| **Companies** | `GET /companies/section` · `PUT /companies/section` 🔒 · `GET /companies` · `GET /companies/:id` · `POST /companies` 🔒 · `PUT/DELETE /companies/:id` 🔒 |
| **Tech Stack** | `GET /techstack` · `PUT /techstack` 🔒 · `POST /techstack/cards` 🔒 · `PUT/DELETE /techstack/cards/:id` 🔒 · `PUT /techstack/cards/reorder` 🔒 |
| **Experience** | `GET /experience/section` · `PUT /experience/section` 🔒 · `GET /experience` · `GET /experience/:id` · `POST /experience` 🔒 · `PUT/DELETE /experience/:id` 🔒 |
| **Projects** | `GET /projects/section` · `PUT /projects/section` 🔒 · `GET /projects` · `GET /projects/:id` · `POST /projects` 🔒 · `PUT/DELETE /projects/:id` 🔒 · `PUT /projects/:id/image` 🔒 (multipart `image`) |
| **Skills** | `GET /skills` · `PUT /skills` 🔒 · `POST /skills/columns` 🔒 · `PUT/DELETE /skills/columns/:id` 🔒 · `PUT /skills/columns/reorder` 🔒 |
| **Process** | `GET /process` · `PUT /process` 🔒 · `POST /process/phases` 🔒 · `PUT/DELETE /process/phases/:id` 🔒 · `PUT /process/phases/reorder` 🔒 |
| **Resume** | `GET /resume` · `PUT /resume` 🔒 · `PUT /resume/file` 🔒 (multipart `file`, PDF) |
| **Contact** (content) | `GET /contact` · `PUT /contact` 🔒 |
| **Social links** | `GET /social` · `PUT /social` 🔒 · `POST /social/primary` 🔒 · `PUT/DELETE /social/primary/:id` 🔒 · `POST /social/footer` 🔒 · `PUT/DELETE /social/footer/:id` 🔒 |
| **Footer** | `GET /footer` · `PUT /footer` 🔒 · `POST /footer/jumps` 🔒 · `PUT/DELETE /footer/jumps/:id` 🔒 |
| **Settings** (admin backgrounds) | `GET /settings` · `PUT /settings/background` 🔒 (multipart `image`, body `target`: `"login"` \| `"home"`) |

Every response is `{ success: true, data }` or `{ success: false, message }`. List
endpoints return `data: []`; mutation endpoints return the created/updated document
(subdocument mutations return the whole parent section so the array is always current).

## Auth

Single admin account (this is a personal portfolio, not multi-tenant) seeded via
`npm run seed:admin`. Login returns a JWT both as an httpOnly cookie (`pf_admin_token`,
what the admin dashboard uses) and in the response body (for tooling/testing). Every
protected route accepts either.

## Not in scope here

Contact-form submissions and visitor analytics stay in **Firebase** (the portfolio
site's separate, already-working integration) — this backend only owns portfolio
*content*. `/api/contact` here is the section's labels/email/engagement-type list, not
the messages people send.

## Folder structure

```
src/
├── config/        db.js, cloudinary.js
├── middleware/     auth, upload (multer), validate, errorHandler, notFound
├── models/         one Mongoose model per resource (16 content + Admin)
├── controllers/     thin — wire factories + the few custom upload handlers
├── routes/          one file per resource, mounted from routes/index.js
├── utils/           the three CRUD factories, ApiError, Cloudinary upload helper
├── app.js           Express app (middleware + routes), no listen()
└── server.js         loads env, connects Mongo, starts listening
scripts/
├── seedAdmin.js      creates the one admin user from .env
├── seedContent.js    loads current portfolio content (idempotent)
└── smokeTest.js       25-assertion end-to-end HTTP test, in-memory Mongo
```
