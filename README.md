# UniCouncil

**A secure, web-based student council election platform.**

UniCouncil lets students register, learn about candidates, and cast a single verified vote for each council position, while administrators manage elections, candidates and live monitoring from a dedicated dashboard. Built for the **Student Council Election 2026**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)

> **Demo data notice:** the candidates, quiz questions and Q&A shown in the app are **dummy data** bundled in `src/app/data/` (`mockData.ts`, `quizData.ts`, `qaData.ts`). They are placeholders to demonstrate the platform and do not represent real people or a real election. Student accounts, votes and turnout are stored in Supabase.

---

## Features

### For students
- **Pre-registration and phone login**: register with name, roll number and phone, then sign in with a one-time password (OTP) sent to your phone.
- **Student dashboard**: election status and voting turnout at a glance.
- **Candidate directory and profiles**: browse sample candidates by position and read each candidate's background and agenda.
- **Candidate-match quiz**: answer questions about your priorities (academics, facilities, social life, environment, finances) and see which candidates align with you.
- **Candidate Q&A**: read candidates' answers to student questions, see the most-upvoted ones first, and submit your own question.
- **Secure voting**: pick one candidate for each of the four positions (President, Vice President, Secretary, Treasurer), review your choices, then confirm with a second **email OTP** before the ballot is submitted.
- **One vote per position**: enforced at the database level, so votes cannot be changed or repeated.
- **Results**: live tallies with charts, plus a **PDF export** of the election results.

### For administrators
- **Separate admin login** (Admin ID and password) with role-protected routes.
- **Dashboard tabs**: Overview, Manage Elections, Manage Candidates, Live Monitoring and Voters List.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 6, React Router 7 |
| Styling and UI | Tailwind CSS 4, Radix UI, shadcn/ui components, MUI, Lucide icons, Motion |
| Charts and export | Recharts, jsPDF, jsPDF-AutoTable |
| Backend and auth | Supabase (Postgres, Row Level Security, Phone Auth) |
| OTP delivery | Supabase SMS Auth Hook → Twilio WhatsApp (phone login); Nodemailer + Gmail (vote email OTP) |
| Hosting | Vercel (static app plus serverless `api/` function), Vercel Analytics and Speed Insights |

---

## How it works

```
Register ──► Phone OTP login ──► Dashboard ──► Browse / Quiz / Q&A
                                                   │
                                                   ▼
              Results ◄── Vote saved ◄── Email OTP ◄── Select & confirm ballot
```

1. **Registration**: a student's name, roll number and phone number are stored in `registered_students`.
2. **Login**: Supabase phone auth sends an OTP. A Supabase Edge Function (`supabase/functions/sms-hook`) is registered as the SMS hook and delivers the code over WhatsApp via Twilio.
3. **Profile creation**: a database trigger (`handle_new_user`) links the new auth user to their pre-registration record and creates a `profiles` row.
4. **Voting**: after the student confirms their ballot, a 6-digit code is emailed through the `/api/send-otp` Vercel function. Entering it submits one row per position to the `votes` table.
5. **Integrity**: `UNIQUE(voter_id, position)` blocks duplicate votes, and there are no update or delete policies on `votes`.
6. **Results**: `get_vote_counts()` and `get_voter_turnout()` are `SECURITY DEFINER` RPC functions that expose aggregate counts without exposing individual ballots.

---

## Project structure

```
UniCouncil/
├── api/
│   └── send-otp.js            # Vercel serverless function: emails the voting OTP
├── public/                    # Static assets (logo, etc.)
├── src/
│   ├── main.tsx               # App entry point
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx         # Route table (student + admin routes)
│   │   ├── components/        # Shared components, ProtectedRoute, shadcn/ui primitives
│   │   ├── context/           # AuthContext (Supabase session + profile)
│   │   ├── data/              # Dummy candidate, quiz and Q&A data
│   │   ├── lib/supabase.ts    # Supabase client
│   │   └── pages/             # Login, Register, Dashboard, Candidates, Quiz, QA,
│   │                          # Voting, Results, Profile, Admin pages
│   └── styles/                # Tailwind and theme CSS
├── supabase/
│   ├── config.toml
│   └── functions/sms-hook/    # Edge Function: sends phone OTPs via Twilio WhatsApp
├── supabase-setup.sql         # Core schema: profiles, registered_students, RLS, triggers
├── create-votes-table.sql     # votes table + RLS
├── create-vote-counts-rpc.sql # Aggregate results RPC functions
├── create-admin.js            # Helper script to create an admin account
├── vercel.json                # SPA rewrite rules
└── vite.config.ts
```

The other `.sql` files in the root are one-off repair, seed and debugging scripts used during development. A fresh setup only needs the three listed above.

---

## Getting started

### Prerequisites
- Node.js 18 or later and npm
- A [Supabase](https://supabase.com) project
- *(For SMS/WhatsApp login)* a Twilio account with the WhatsApp sandbox or a sender
- *(For vote email OTP)* a Gmail account with an [App Password](https://support.google.com/accounts/answer/185833)

### 1. Clone and install

```bash
git clone https://github.com/Saksham07518/UniCouncil.git
cd UniCouncil
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (it is already git-ignored):

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

For the serverless email function, set these in your **Vercel project's Environment Variables**:

```env
GMAIL_USER=<your-gmail-address>
GMAIL_APP_PASSWORD=<your-gmail-app-password>
```

For the SMS hook, set these as **Supabase Edge Function secrets**:

```env
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   # optional, defaults to the Twilio sandbox number
```

### 3. Set up the database

In the Supabase **SQL Editor**, run these in order:

1. `supabase-setup.sql`
2. `create-votes-table.sql`
3. `create-vote-counts-rpc.sql`

### 4. Enable phone login

In your Supabase dashboard, enable **Phone** authentication and register the deployed `sms-hook` function as the **Send SMS** auth hook:

```bash
supabase functions deploy sms-hook
```

### 5. Create an admin

The admin page at `/admin/login` signs in a single central admin account (an Admin ID plus password), so that account must exist in Supabase Auth with `role = 'admin'` in `profiles` (a commented example is at the bottom of `supabase-setup.sql`). `create-admin.js` can create the account; it reads the Supabase variables from your environment. Change the account's email, ID and password to your own values before using this anywhere real.

### 6. Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

> **Local note:** `npm run dev` does not serve the `api/` folder. On `localhost`, the voting page falls back to **test mode** and prints the email OTP in the browser console. Use `vercel dev` to exercise the real email function.

### Build

```bash
npm run build
```

---

## Deployment

The project is configured for [Vercel](https://vercel.com):

1. Import the repository into Vercel.
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GMAIL_USER` and `GMAIL_APP_PASSWORD` under **Settings → Environment Variables**.
3. Deploy. `vercel.json` rewrites all routes to `index.html` so client-side routing works.

---

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/login`, `/register` | Public | Student login and registration |
| `/admin/login` | Public | Administrator sign-in |
| `/dashboard` | Student | Home and turnout overview |
| `/candidates`, `/candidates/:id` | Student | Candidate list and profiles |
| `/quiz` | Student | Candidate-match quiz |
| `/qa` | Student | Candidate Q&A |
| `/vote`, `/vote-confirmation` | Student | Ballot and confirmation |
| `/results` | Student | Results and PDF export |
| `/profile` | Student | Student profile |
| `/admin`, `/admin/profile` | Admin only | Admin dashboard and profile |

---

## Acknowledgements

- UI primitives from [shadcn/ui](https://ui.shadcn.com/) (MIT License)
- Photos from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license)
- Initial UI scaffolded with Figma Make

---

## Author

**Saksham**: [GitHub](https://github.com/Saksham07518)
