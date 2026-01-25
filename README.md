# SageBridge Frontend (SPA)

Stack: **Next.js (App Router) + React + TypeScript + TailwindCSS + Redux Toolkit + RTK Query**.

✅ Single Page Application: une seule route (`/`) avec navigation via `#purchase`, `#claims`, `#stock`.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre: `http://localhost:3000`

## Backend (plus tard)

Configure l'URL du backend:

Crée un fichier `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Endpoints attendus:
- `POST /api/purchase-requests`
- `POST /api/claims`
- `GET  /api/stock?q=&site=`

## Notes
- Les mutations/queries sont dans: `src/lib/api/baseApi.ts`
- Les forms sont pilotés par Redux slices dans: `src/features/*`
