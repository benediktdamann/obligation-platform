# Obligation Platform

EU AML/CFT Regulatory Compliance Platform — zentrales System zur Verwaltung und Nachverfolgung regulatorischer Pflichten unter EU-Rahmenwerken (AMLD6, MiCA, DORA).

## Tech Stack

- **[Next.js 15](https://nextjs.org)** — App Router, Server Components, TypeScript
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first Styling
- **[shadcn/ui](https://ui.shadcn.com)** — Komponentenbibliothek (Slate, CSS Variables)
- **[Supabase](https://supabase.com)** — Datenbank & Auth (`@supabase/ssr`, `@supabase/supabase-js`)

## Setup

**1. Repository klonen**

```bash
git clone https://github.com/benediktdamann/obligation-platform.git
cd obligation-platform
```

**2. Abhängigkeiten installieren**

```bash
npm install
```

**3. Umgebungsvariablen konfigurieren**

```bash
cp .env.example .env.local
```

Dann `.env.local` befüllen:

```env
NEXT_PUBLIC_SUPABASE_URL=<deine-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dein-anon-key>
```

**4. Dev-Server starten**

```bash
npm run dev
```

App läuft unter [http://localhost:3000](http://localhost:3000).
