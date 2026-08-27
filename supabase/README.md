# supabase/ — linked project, not a schema owner

Schema ownership for this project's Postgres database lives in
**`fastapi-supabase-starter`** (Alembic) — see that repo's
`migrations/versions/`. This repo does not run `supabase db push` for
application tables and no longer keeps a `migrations/` folder here; that
history now lives in the backend's Alembic revisions and this repo's git
log.

## What this folder is for

Just keeping the Supabase CLI linked (`config.toml` + `.temp/`) so this
command keeps working after any backend migration:

```
supabase gen types typescript --linked --schema public > types/database.ts
```

`types/database.ts` (generated) and `types/db.ts` (hand-written friendly
aliases over it) are the only things this linkage produces. See their file
headers for details.

## Going forward

- Schema changes: made in `fastapi-supabase-starter` (SQLAlchemy model +
  Alembic revision), same pattern as `app/models/restaurant.py`.
- App writes to dishes/prices/taxes go through the backend's API, not
  direct Supabase table access — `lib/supabase.ts` here is scoped to
  **auth only** (phone OTP / session), which is a legitimate direct use of
  the Supabase client from the app.
