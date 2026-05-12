# Backend SafetyPro Sénégal - API E-commerce

API REST backend pour l'application SafetyPro Sénégal, construite avec Hono, Prisma et PostgreSQL. Architecture Repository-Service-Controller (RSC).

## Technologies

- **Hono** : Framework web léger et rapide
- **Prisma** : ORM pour PostgreSQL
- **Zod** : Validation des données
- **JWT** : Authentification
- **TypeScript** : Typage fort

## Architecture RSC

```
HTTP Request → Routes → Controller → Service → Repository → Database
```

- **Repository** : Accès aux données (Prisma)
- **Service** : Logique métier et validation
- **Controller** : Gestion HTTP et réponses API

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Créer une base de données PostgreSQL
2. Modifier `.env` avec votre DATABASE_URL
3. Générer le client Prisma :
```bash
npm run prisma:generate
```
4. Appliquer les migrations :
```bash
npm run prisma:migrate
```

## Démarrage

```bash
npm run dev
```

Le serveur démarre sur http://localhost:3002

## Seed produits

Pour remplir rapidement le catalogue avec beaucoup de produits de demo :

```bash
npm run seed:products
```

Pour verifier le catalogue prepare sans ecrire en base :

```bash
npm run seed:products -- --dry-run
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion admin

### Produits
- `GET /api/produits` - Lister les produits
- `GET /api/produits/:id` - Détail d'un produit
- `POST /api/admin/produits` - Créer un produit (admin)
- `PATCH /api/admin/produits/:id` - Modifier un produit (admin)
- `DELETE /api/admin/produits/:id` - Supprimer un produit (admin)

### Commandes
- `POST /api/commandes` - Créer une commande
- `GET /api/admin/commandes` - Lister les commandes (admin)
- `GET /api/admin/commandes/:id` - Détail d'une commande (admin)
- `PATCH /api/admin/commandes/:id/statut` - Mettre à jour le statut (admin)

### Personnalisations
- `POST /api/personnalisations` - Envoyer une demande
- `GET /api/admin/personnalisations` - Lister les demandes (admin)
- `PATCH /api/admin/personnalisations/:id/statut` - Mettre à jour le statut (admin)

### Contacts
- `POST /api/contacts` - Envoyer un message de contact

### Contacts (Admin - Authentification requise)
- `GET /api/admin/contacts` - Lister tous les contacts
- `GET /api/admin/contacts/stats` - Statistiques des contacts
- `GET /api/admin/contacts/:id` - Détails d'un contact
- `PATCH /api/admin/contacts/:id` - Modifier un contact
- `PATCH /api/admin/contacts/:id/read` - Marquer comme lu
- `DELETE /api/admin/contacts/:id` - Supprimer un contact

## Tests

### Login admin (pour obtenir un token)
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@safetypro.sn","password":"admin123"}'
```

### Créer un contact
```bash
curl -X POST http://localhost:3002/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "message": "Message de test pour SafetyPro"
  }'
```

### Lister les contacts (avec token)
```bash
curl -X GET http://localhost:3002/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuration Prisma
│   ├── controllers/                # Gestion HTTP
│   ├── services/                   # Logique métier
│   ├── repositories/               # Accès DB
│   ├── models/                     # Types et validations
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Authentification JWT
│   │   └── validation.middleware.ts # Validation Zod
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── contacts.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── personalizations.routes.ts
│   │   └── products.routes.ts
│   └── index.ts                     # Serveur principal
├── prisma/
│   ├── schema.prisma                # Schéma DB
│   └── migrations/                  # Migrations DB
├── package.json
├── tsconfig.json
└── .env
```

## Sécurité

- Authentification JWT pour les routes admin
- Validation Zod des données d'entrée
- Gestion d'erreurs structurée
- Logs pour debugging

## Développement

- `npm run dev` : Démarrage en développement (avec tsx)
- `npm run build` : Compilation TypeScript
- `npm run prisma:studio` : Interface graphique Prisma
- `npm run prisma:migrate` : Appliquer les migrations
# bddevbackend
