# FMG setup — connected to your Supabase project

The `.env.local` file is already configured with the FMG Supabase Project URL and publishable key you supplied.

## 1. Create the database
In Supabase open **SQL Editor**, create a new query, paste `supabase/schema.sql`, and click **Run**.

## 2. Create private storage buckets
Open **Storage** and create two private buckets:
- `fmg-audio`
- `fmg-artwork`

Do not make artist audio uploads public by default.

## 3. Create the first FMG owner
Create your own account through the FMG registration page first. Then, in Supabase SQL Editor, replace the email below and run:

```sql
update public.profiles
set role = 'owner'
where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');
```

Only do this for the FMG owner account. Normal registration creates artists.

## 4. Run the web app
Install Node.js 20+, then:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Security
The `sb_publishable_...` key is designed by Supabase to be used in browser/mobile applications. Access must still be controlled with Row Level Security. Never add a Supabase secret key to `.env.local` with a `NEXT_PUBLIC_` prefix or ship a secret key in the Android app.
