# Propel SaaS - Analyse Complète & Recommandations Features

## Etat actuel du projet

| Composant | Statut |
|-----------|--------|
| **Framework** | Vite + React 19 + TypeScript |
| **Styling** | Tailwind CSS (CDN) |
| **Backend/API** | AUCUN - Frontend uniquement avec mock data |
| **Base de données** | AUCUNE - Données mockées dans `mockData.ts` |
| **Authentification** | NON IMPLEMENTEE (UI placeholder) |
| **Stripe / Paiements** | AUCUNE INTEGRATION |
| **Pages fonctionnelles** | 6/8 (Inbox et Reports = placeholders) |
| **CRUD Operations** | AUCUNE (boutons sans action) |
| **Recherche** | UI présente, logique absente |

---

## FEATURES REQUISES POUR UNE APPLICATION 100% FONCTIONNELLE

### 1. CRITIQUE - Backend & Infrastructure

#### 1.1 API Backend (Serveur Node.js/Express)
- **Pourquoi** : L'app est 100% frontend avec mock data. Aucune opération réelle n'est possible.
- **Ce qu'il faut** :
  - Serveur Express.js ou Fastify avec TypeScript
  - Architecture REST API ou tRPC
  - Routes pour : `/api/leads`, `/api/properties`, `/api/buyers`, `/api/contracts`, `/api/call-logs`, `/api/auth`
  - Middleware de validation (Zod)
  - Gestion des erreurs centralisée
  - Rate limiting & CORS

#### 1.2 Base de Données
- **Pourquoi** : Toutes les données sont hardcodées dans `mockData.ts`
- **Ce qu'il faut** :
  - PostgreSQL (recommandé pour les données relationnelles immobilier)
  - ORM : Prisma ou Drizzle
  - Schéma pour : Users, Leads, Properties, Buyers, Sellers, Contracts, CallLogs, AIActions
  - Migrations & Seeds

#### 1.3 Authentification & Autorisation
- **Pourquoi** : Le bouton "Log out" ne fait rien, l'avatar "JD" est hardcodé, aucun système de login
- **Ce qu'il faut** :
  - Page de Login / Register
  - JWT ou Session-based auth
  - Rôles : Admin, Agent, Manager
  - Protection des routes API
  - Middleware d'authentification
  - Gestion du profil utilisateur

---

### 2. CRITIQUE - Intégration Stripe (Monétisation SaaS)

#### 2.1 Plans d'abonnement
- **Plan Starter** : 1 agent, 50 leads/mois, fonctions de base
- **Plan Pro** : 5 agents, leads illimités, AI Voice Agent, rapports avancés
- **Plan Enterprise** : Agents illimités, API access, support dédié, white-label

#### 2.2 Fonctionnalités Stripe requises
- Checkout Session pour l'onboarding
- Customer Portal pour gérer l'abonnement
- Webhooks pour synchroniser les événements (payment_succeeded, subscription_updated, etc.)
- Gestion des factures
- Période d'essai (trial)
- Upgrade/Downgrade de plan
- Usage-based billing (optionnel : facturer par nombre d'appels AI)

#### 2.3 Pages UI nécessaires
- Page Pricing / Plans
- Page Billing / Subscription dans Settings
- Historique des factures
- Indicateur de plan actuel dans la sidebar

> **Voir la section Stripe détaillée plus bas**

---

### 3. HAUTE PRIORITE - Fonctionnalités CRUD

#### 3.1 Leads - Opérations manquantes
- **Add Lead** : Le bouton `<Plus /> Add Lead` n'ouvre aucun formulaire
- **Edit Lead** : Le bouton "Edit" dans la table ne fait rien
- **Delete Lead** : Aucune option de suppression
- **Search** : L'input de recherche ne filtre pas les données
- **Filter** : Le bouton Filter n'ouvre aucun panneau
- **Download/Export** : Le bouton Download ne génère aucun fichier
- **Lead Detail View** : Pas de vue détaillée avec historique des activités
- **Status Update** : Impossible de changer le statut d'un lead (NEW → CONTACTED → QUALIFIED, etc.)

#### 3.2 Properties - Opérations manquantes
- **Add Property** : Formulaire d'ajout avec upload d'images
- **View Details** : Le bouton existe mais aucune page détail
- **Edit Property** : Modifier prix, statut, description
- **Delete Property** : Supprimer une propriété
- **Image Gallery** : Vue carrousel des photos
- **Property Status Update** : FOR_SALE → UNDER_OFFER → SOLD
- **Map Integration** : Afficher la localisation sur une carte

#### 3.3 Buyers - Opérations manquantes
- **Add Buyer** : Formulaire d'ajout
- **Match Properties** : Algorithme de matching buyer ↔ property basé sur budget, localisation, critères
- **Contact** : Le bouton "Contact" ne lance aucune action (email, call, SMS)
- **Buyer Detail View** : Historique des interactions, propriétés matchées

#### 3.4 Contracts - Opérations manquantes
- **New Contract** : Formulaire avec sélection buyer/seller/property
- **View Contract** : Page détail avec timeline des étapes
- **Edit Contract** : Modifier dates, prix, frais
- **Document Generation** : Générer des PDF (compromis, mandat)
- **E-Signature Integration** : DocuSign/HelloSign pour signature électronique

#### 3.5 Call Logs - Opérations manquantes
- **Filter/Search** : Filtrer par date, sentiment, statut
- **Export** : Exporter les logs en CSV/PDF
- **Real Audio Playback** : L'audio player est un fake (waveform générée aléatoirement)
- **AI Action Execution** : Les actions AI sont affichées mais non exécutables

---

### 4. HAUTE PRIORITE - Pages Placeholder

#### 4.1 Inbox (Message Center)
- **Statut actuel** : Placeholder "Under development"
- **Ce qu'il faut** :
  - Liste des conversations (email, SMS, WhatsApp, chat widget)
  - Vue conversation threaded
  - Composition de messages
  - Templates de réponse
  - Marquage lu/non-lu
  - Assignation à un agent
  - Intégration avec les Leads (associer une conversation à un lead)

#### 4.2 Reports & Analytics
- **Statut actuel** : Placeholder "Under development"
- **Ce qu'il faut** :
  - KPIs détaillés avec comparaison période (semaine, mois, trimestre)
  - Rapport de performance par agent
  - Funnel de conversion (Lead → Contact → Qualified → Negotiation → Closed)
  - Revenue tracking (CA réalisé vs objectif)
  - Rapport d'activité des appels AI
  - Taux de conversion par source (Voice Agent, Chat, Web Form, Manual)
  - Export PDF/CSV des rapports
  - Graphiques personnalisables

---

### 5. MOYENNE PRIORITE - Features UX/UI

#### 5.1 Recherche Globale
- **Statut** : La barre de recherche du Topbar ne fait rien
- **Ce qu'il faut** :
  - Recherche cross-entity (leads, properties, buyers, contracts)
  - Résultats en dropdown avec catégorisation
  - Navigation directe vers le résultat
  - Raccourci clavier (Cmd+K / Ctrl+K)

#### 5.2 Notifications
- **Statut** : L'icône Bell avec badge rouge existe, mais aucune fonctionnalité
- **Ce qu'il faut** :
  - Liste de notifications en dropdown
  - Types : nouveau lead, appel manqué, action AI requise, contrat à signer
  - Notifications en temps réel (WebSocket)
  - Notification push navigateur
  - Email de notification configurable

#### 5.3 Settings Page
- **Statut** : Le NavItem "Settings" dans la sidebar ne fait rien
- **Ce qu'il faut** :
  - Profil utilisateur (nom, email, avatar, mot de passe)
  - Paramètres de l'agence (nom, logo, adresse)
  - Gestion des agents/utilisateurs (Admin)
  - Intégrations tierces (Stripe, email, calendar)
  - Configuration des notifications
  - Billing & Subscription (Stripe)
  - API Keys management

#### 5.4 Mobile Sidebar
- **Statut** : Le bouton hamburger existe mais ne toggle aucun menu mobile
- **Ce qu'il faut** : Drawer/overlay sidebar pour mobile

---

### 6. MOYENNE PRIORITE - Intégrations

#### 6.1 Gemini AI Integration
- **Statut** : Config existe dans `vite.config.ts` (`GEMINI_API_KEY`) mais JAMAIS utilisée
- **Ce qu'il faut** :
  - Chat assistant intégré pour les agents
  - Auto-summary des appels
  - Suggestions de réponse pour l'Inbox
  - Scoring automatique des leads
  - Matching intelligent buyer/property

#### 6.2 Email Integration
- **Ce qu'il faut** : SendGrid/Resend pour envoyer des emails transactionnels et marketing

#### 6.3 Calendar Integration
- **Ce qu'il faut** : Google Calendar/Outlook pour planifier les visites

#### 6.4 SMS/WhatsApp
- **Ce qu'il faut** : Twilio pour SMS et WhatsApp Business API

---

### 7. NICE-TO-HAVE - Améliorations

| Feature | Description |
|---------|-------------|
| **Multi-langue** | Le code mélange français et anglais. Implémenter i18n (react-intl) |
| **Real-time Updates** | WebSocket pour données live (nouveaux leads, statuts) |
| **File Upload** | Upload d'images pour properties, documents pour contracts |
| **Drag & Drop** | Kanban board pour le pipeline des leads |
| **Dark/Light Mode** | FAIT - Fonctionne correctement |
| **Responsive Design** | Partiellement fait (breakpoints md:) mais sidebar mobile manquante |
| **PWA** | Progressive Web App pour usage mobile |
| **Audit Log** | Traçabilité de toutes les actions |
| **Data Import** | Import CSV/Excel pour migration de données |

---

## CONFIGURATION STRIPE DETAILLEE

### Architecture Stripe recommandée

```
Frontend (React)                    Backend (Express)                 Stripe
┌─────────────┐                    ┌─────────────────┐              ┌──────────┐
│ Pricing Page │───Create Checkout──▶│ POST /api/stripe │──────────▶│ Checkout │
│ Settings     │◀──Redirect────────│   /checkout      │◀─Webhook───│ Session  │
│ Billing      │───Portal──────────▶│ POST /api/stripe │──────────▶│ Portal   │
│              │                    │   /portal        │            │          │
│              │                    │ POST /api/stripe │◀─Webhook───│ Events   │
│              │                    │   /webhook       │            │          │
└─────────────┘                    └─────────────────┘              └──────────┘
```

### Endpoints API Stripe nécessaires

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/stripe/checkout` | POST | Crée une Checkout Session |
| `/api/stripe/portal` | POST | Crée un lien Customer Portal |
| `/api/stripe/webhook` | POST | Reçoit les webhooks Stripe |
| `/api/stripe/subscription` | GET | Récupère l'abonnement actuel |
| `/api/stripe/invoices` | GET | Liste les factures |

### Webhooks Stripe à écouter

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Créer/activer l'abonnement en BDD |
| `customer.subscription.updated` | Mettre à jour le plan |
| `customer.subscription.deleted` | Désactiver le compte |
| `invoice.payment_succeeded` | Enregistrer le paiement |
| `invoice.payment_failed` | Notifier l'utilisateur, limiter l'accès |

### Variables d'environnement requises

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

### Plans Stripe à créer dans le Dashboard

| Plan | Prix/mois | Stripe Price ID |
|------|-----------|-----------------|
| Starter | 49 EUR | `price_starter_monthly` |
| Pro | 149 EUR | `price_pro_monthly` |
| Enterprise | 399 EUR | `price_enterprise_monthly` |

---

## PRIORITISATION & ROADMAP

### Phase 1 - Fondations (Backend + Auth + DB)
1. Mettre en place le backend Express + TypeScript
2. Configurer PostgreSQL + Prisma
3. Implémenter l'authentification (JWT)
4. Migrer les mock data vers la BDD
5. Connecter le frontend aux API

### Phase 2 - CRUD Complet
1. CRUD Leads (create, read, update, delete, search, filter)
2. CRUD Properties (+ upload images)
3. CRUD Buyers
4. CRUD Contracts
5. Search globale fonctionnelle

### Phase 3 - Stripe & Monétisation
1. Intégration Stripe Checkout
2. Customer Portal
3. Webhooks
4. Page Pricing
5. Page Billing dans Settings

### Phase 4 - Modules Avancés
1. Inbox / Messages
2. Reports & Analytics
3. Notifications en temps réel
4. Settings complet

### Phase 5 - Intégrations & Polish
1. Gemini AI integration
2. Email (SendGrid/Resend)
3. Calendar sync
4. SMS/WhatsApp (Twilio)
5. Multi-langue (i18n)
6. Mobile PWA

---

## Résumé Exécutif

L'application Propel Dashboard est une **excellente maquette frontend** avec un design professionnel et une UX soignée. Cependant, elle est actuellement **0% fonctionnelle** en termes de logique métier :

- **0 endpoint API** - Tout est mockdata
- **0 opération CRUD** - Tous les boutons sont des placeholders
- **0 authentification** - Pas de login/register
- **0 intégration** - Stripe, email, calendar, AI inexistants
- **2 pages vides** - Inbox et Reports sont des placeholders

Pour atteindre **100% fonctionnel**, il faut implémenter les **5 phases** ci-dessus. La Phase 1 (Backend + Auth + DB) est le prerequis absolu pour tout le reste.
