## To Do App Front

Frontend Next.js d'une application de gestion de tableaux inspirée de Trello.

## Configuration

1. Copier le fichier d'environnement :

```bash
cp .env.example .env.local
```

2. Vérifier que l'URL API pointe vers ton backend Swagger :

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

3. Installer les dépendances puis lancer le projet :

```bash
npm install
npm run dev
```

## Intégration backend (Swagger)

- Le client OpenAPI est configuré dans `src/lib/api/client.ts`.
- Le token est envoyé au format `Authorization: Token <token>` (conforme à `swagger.json`).
- L'authentification est centralisée via `src/components/AuthContext.tsx`.

## Parcours principal

- `src/app/login/page.tsx` : connexion et stockage du token
- `src/app/page.tsx` : affichage et création de boards
- `src/app/board/[id]/page.tsx` : affichage et création de listes
- `src/components/ui/ListColumn.tsx` : affichage et création de cartes
