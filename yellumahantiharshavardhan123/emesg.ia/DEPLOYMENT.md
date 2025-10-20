# Deployment — E‑MESG

This guide covers Vercel hosting and Supabase setup.

## 1) Supabase setup
1. Create a new Supabase project
2. Go to SQL editor and run `supabase.sql` from this repo (creates tables, RLS policies, storage bucket policies)
3. Enable Google OAuth in Authentication → Providers (Google):
   - Add Redirect URL: `https://your-vercel-domain.vercel.app/dashboard` and `http://localhost:5173/dashboard`
4. Storage → Buckets: ensure `chat-media` and `vibes` exist (script creates them). Confirm both are public for MVP.
5. Get the Project URL and anon key from Settings → API, add to Vercel env as below.

## 2) Local environment
- Copy `.env.local.example` to `.env.local`
- Update values if needed

## 3) Vercel
1. Create a new Vercel project from GitHub repo
2. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Framework preset: Vite
4. Build Command: `bun run build` (or `npm run build`)
5. Output directory: `dist`
6. Deploy

## 4) App URLs to configure in Supabase
- Production: `https://<your-vercel-domain>/dashboard`
- Local: `http://localhost:5173/dashboard`

## 5) Notes
- Phone auth is not enabled for MVP; UI is stubbed.
- Anon key is client-safe; do not commit service role or private keys.
