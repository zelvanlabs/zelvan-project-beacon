# Zelvan Project Beacon

Build the marketing website and admin panel for **Zelvan Labs**, a small tech studio that builds chatbots and AI agents, websites, and web apps for businesses. Audience: business owners and founders who need software built. Primary job of the site: get them to send a project enquiry. Stack: Vite + React + TypeScript + Tailwind + shadcn/ui + react-router. The site will be deployed as a Cloudflare Worker with static assets (details at the bottom).

# BACKEND: use my existing external Supabase project. Do NOT enable Lovable Cloud and do NOT create tables or migrations.
Everything already exists and is secured with RLS. Create `src/lib/supabase.ts` using @supabase/supabase-js with these (public, safe to commit) values:
- URL: https://yhycienqysoorvxbwfbv.supabase.co
- Publishable key: sb_publishable_UzhBRnFSYeZbduMTQJDbsQ_1jrToJhX
Existing schema (do not alter):
- `leads` (id, created_at, updated_at, name, email, company, service in chatbot|website|webapp|other, budget, message, status in new|contacted|qualified|proposal|won|lost, notes). Only admins can select/update/delete. Public insert is NOT allowed directly.
- `projects` (id, created_at, updated_at, title, slug unique lowercase-hyphen, category in chatbot|website|webapp|other, summary, tags text[], url, cover_url, is_demo bool, published bool, sort_order int). Anyone can read published rows; admins can do everything.
- `user_roles` (user_id, role 'admin'). RPC `has_role(_user_id uuid, _role 'admin')` returns boolean for signed-in users.
- Edge function `submit-lead` (public, POST JSON to `https://yhycienqysoorvxbwfbv.supabase.co/functions/v1/submit-lead` with headers `Content-Type: application/json` and `apikey: <publishable key>`). Body: `{name, email, company?, service, budget?, message, website}`; `website` is a hidden honeypot field that must stay empty. Responds `{ok:true}` or `{error:"..."}` with status 422/429/500; show the error text to the user.
Admin auth = Supabase Auth email + password. Signing up with the allowlisted email automatically grants the admin role after email confirmation. Anyone else who signs up gets no access.

# BRAND
Name: Zelvan Labs. Wordmark: "zelvan" in bold followed by "labs" in regular weight, all lowercase, same size, tight tracking (-0.01em).
Logo mark (use this exact SVG as a React `Logo` component with props `zColor` and `size`; default zColor is ink, the V is always amber):
```
<svg viewBox="0 0 110 80" fill="none"><defs><clipPath id="top"><rect x="0" y="11.5" width="110" height="60"/></clipPath></defs><path d="M14 16H38L14 64H38" stroke="{zColor}" stroke-width="9" stroke-linejoin="bevel"/><g clip-path="url(#top)"><path d="M44.75 8L74 66.5L103.25 8" stroke="#F2A33A" stroke-width="9" stroke-linejoin="bevel"/></g></svg>
```
Use a unique clipPath id per instance (React useId). Create `public/favicon.svg` with the same mark on a rounded ink square (rect 110x80 -> use viewBox 0 0 110 110 with the mark centred, rect rx=22 fill #0F2A2E, Z stroke #E8EDE9, V stroke #F2A33A).
Colour tokens (define as CSS variables and map to Tailwind; replace the default shadcn palette entirely, no purple, no default slate/zinc):
- chalk #E8EDE9 (page background, a cool mineral off-white)
- ink #0F2A2E (text, dark sections)
- verdigris #1F5C63 (links, secondary buttons, focus rings)
- amber #F2A33A (the single accent: primary buttons and highlights; always paired with ink text, never used as text colour on chalk)
- mist #B8C7C1 (borders, dividers, muted surfaces)
Derive any extra tints from these. Keep body text contrast at WCAG AA or better.
Typography: ONE family, **Familjen Grotesk** (Google Fonts, weights 400/500/700), for everything. Headlines 700 with letter-spacing -0.02em and line-height 1.05; h1 uses clamp(2.6rem, 6vw, 5rem). Body 17-18px, line-height 1.6, line length under 70 characters. Sentence case everywhere.
Design rules (important, the client rejected templated looks):
- Left-aligned layouts, generous whitespace, an asymmetric 12-column grid.
- NO: tracked-out ALL-CAPS eyebrow labels above headings, middle-dot separated strings, "→" appended to buttons, single accented word in a headline, rows of identical rounded cards with soft grey shadows, gradient wash backgrounds, fade-and-slide-up animation on every section, monospace labels.
- Use hairline dividers and big type for structure instead of cards. Border radius: 2px on inputs/buttons only where needed; keep it small and consistent.
- Motion: exactly ONE orchestrated moment (the hero chat demo). Everything else only animates in response to user action. Respect prefers-reduced-motion.
- Visible keyboard focus (verdigris ring), fully responsive from 360px up, semantic HTML, alt text, skip link.

# PAGES (single-page marketing site at `/`, plus `/admin/*`)
Sticky slim header: logo + wordmark left; links Services, How we work, Work, FAQ; amber "Start a project" button right; mobile menu.

1. **Hero.** Headline: "Chatbots that answer. Websites that load. Apps that work." Sub (max 2 lines): "Zelvan Labs is a small tech studio. We design, build and look after the digital side of your business, from the first sketch to launch and after." Buttons: "Start a project" (scrolls to contact) and a text link "Talk to our demo bot". The memorable element is on the right (stacked under on mobile): a **live chat demo window** in ink with chalk text, a header showing the logo mark and "Zel, demo bot", and a badge "Scripted demo". On page load it plays one short scripted conversation (typing indicator, then messages appearing one by one, about 6 seconds total) where a visitor asks about building a support chatbot and Zel replies with how a project works (scope call, fixed quote, weekly demos, launch). After the intro, show tappable quick-reply chips: "How long does a project take?", "Who owns the code?", "Can you work with my existing site?", "Talk to a human". Each chip appends the visitor's question and a scripted answer (write short, honest answers: typical small projects take 2 to 6 weeks depending on scope; you own the code and everything we build once the project is paid for; yes, we can extend or rebuild an existing site; "Talk to a human" scrolls to the contact form). It must be keyboard accessible with aria-live for new messages. Do not call any AI API; it is fully scripted.
2. **Services.** Headline "What we build". An editorial list (NOT cards): each service is a full-width row with hairline divider, large service name left, a two-sentence description and a short comma-separated list of typical deliverables right. Rows: 
   - Chatbots and AI agents: support bots, lead-qualifying bots and internal assistants that answer from your own documents; on your website, WhatsApp or Slack. 
   - Websites: fast, search-friendly sites for businesses, with a simple way for you to edit content yourself.
   - Web apps: dashboards, client portals, booking systems, internal tools and MVPs.
   Below the list one line: "Something else? Automations, integrations and APIs are part of the job too. Tell us what you need."
3. **How we work.** Ink background section (the one dark band). A genuine sequence, so numbering is appropriate: 1 Scope call (a free 30-minute conversation about what you need), 2 Fixed quote (a written scope, timeline and price you can sign), 3 Build in the open (you see a working demo every week), 4 Launch and support (we deploy it, hand over everything, and stay on for changes).
4. **Work.** Headline "Work". Load `projects` where published=true ordered by sort_order from Supabase and render them as a clean list/grid with title, category, summary, tags, optional link, and a small "In-house demo" tag when is_demo is true. If there are none, render an honest empty state: a short paragraph "We are early. These are the first things we are building in-house so you can see how we work." followed by three concept rows clearly marked "In progress": a customer-support chatbot for a clinic, a booking site for a local service business, and a lead dashboard web app. No fake clients, no fake testimonials, no invented stats anywhere on the site.
5. **FAQ.** Accordion with 5 questions: How much does a project cost (answer: it depends on scope; small websites and chatbots usually need a short call first; every project gets a fixed-price written quote before work starts), How long does it take, Who owns the code (you do), Do you work with clients outside Pakistan (we are remote-first and work with clients worldwide; payment by international bank transfer), What happens after launch (optional monthly support for fixes, updates and improvements).
6. **Contact** (`id="contact"`). Headline "Tell us what you are building". Left: short paragraph and the email `zelvanlabs@gmail.com` (put the email, brand name and tagline in one `src/config/site.ts` so they are easy to change later). Right: the form: name, email, company (optional), "What do you need?" select (Chatbot or AI agent, Website, Web app, Something else), budget select (Under $1k, $1k to $3k, $3k to $10k, $10k+, Not sure yet) optional, message textarea, hidden honeypot field named `website`. Client-side validation with clear inline errors in plain language, a disabled-while-sending button, success state that replaces the form with "Thanks, we got it. We reply within one business day." and a way to send another. POST to the `submit-lead` function described above.
7. **Footer.** Logo + wordmark, one line "Zelvan Labs. Chatbots, websites and web apps.", email link, copyright year computed at runtime.

# ADMIN PANEL (`/admin`, lazy-loaded, noindex)
Lighter, denser UI using the same tokens (chalk background, white panels, ink text, verdigris actions, amber only for primary actions).
- `/admin/login`: email + password sign-in; a small "First time? Create the admin account" toggle for sign-up that explains only the owner's email gets access and a confirmation email will be sent. Show a friendly message when the email needs confirming.
- Route guard: after auth, check `has_role` via `supabase.rpc('has_role', {_user_id, _role:'admin'})`. If false show a "You do not have access" screen with a sign-out button. Session persists.
- Layout: left sidebar (logo, Dashboard, Leads, Projects, Settings, sign out), top bar on mobile.
- **Dashboard**: stat tiles for total leads, new, in progress (contacted+qualified+proposal), won; a leads-per-week bar chart for the last 12 weeks (recharts, palette tokens: verdigris bars); a list of the 5 latest leads.
- **Leads**: table with search (name, email, company), status filter, service filter, sort by date; status shown as coloured text badges (use palette-derived tints, not default red/green); click a row to open a right-side sheet with all fields, a status select (updates immediately with a toast), a notes textarea with an explicit Save button, a "Reply by email" mailto link with a prefilled subject, and a delete button with confirmation. "Export CSV" of the filtered rows. Empty and loading states.
- **Projects**: list with published toggle inline; "New project" dialog and edit dialog with fields title, slug (auto from title, editable, validated), category, summary, tags (comma separated), url, cover image url, is_demo switch, published switch, sort order; delete with confirmation. Show Supabase errors as toasts.
- **Settings**: shows signed-in email, a change-password form (supabase.auth.updateUser), and a note that more admins are added in the database allowlist.

# DEPLOYMENT FILES (Cloudflare Workers static assets)
- Add `wrangler.jsonc`: `{"$schema":"node_modules/wrangler/config-schema.json","name":"zelvan-labs","compatibility_date":"2026-11-01","assets":{"directory":"./dist","not_found_handling":"single-page-application"}}`.
- Add `wrangler` as a devDependency and package.json scripts: `"deploy": "npm run build && wrangler deploy"`, `"preview:worker": "npm run build && wrangler dev"`.
- Add `public/robots.txt` allowing all except `/admin`.
- Add a short `README.md`: what the project is, env/config locations, `npm run dev`, and the Cloudflare deploy steps (connect GitHub repo in Cloudflare Workers Builds with build command `npm run build` and deploy command `npx wrangler deploy`).

# SEO and polish
Title "Zelvan Labs | Chatbots, websites and web apps". Meta description under 160 characters. Open Graph and Twitter tags (use the favicon/logo as a placeholder image for now). JSON-LD Organization. Set `lang="en"`. Lighthouse-friendly: load only the font weights used, no large unoptimised assets, no layout shift.

Start by building the whole thing end to end. When finished, summarise what was built and anything you could not do.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de761bc4-52e3-4628-8c9a-421c95c7b193).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
