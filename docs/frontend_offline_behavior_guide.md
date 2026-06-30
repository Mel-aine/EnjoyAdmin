# Guide du comportement offline — Frontend EnjoyAdmin

Ce document définit le périmètre fonctionnel du mode **offline-first** de l'application EnjoyAdmin.

---

## ✅ Services qui fonctionnent en mode offline

| Domaine | Services API | Resource Types | Comportement |
|---------|-------------|----------------|--------------|
| **Réservations** | `reservation.ts` | `reservation`, `reservation_room`, `folio`, `guest`, `room` | GET → cache IndexedDB. POST/PUT/DELETE → file d'attente + cache optimiste |
| **Clients** | `guestApi.ts` | `guest` | GET → cache. Écritures → file d'attente |
| **Chambres / Types** | `roomTypeApi.ts`, `roomRatesApi.ts`, `roomstatusApi.ts`, `roomBlockApi.ts` | `room_type`, `room_rate`, `room`, `room_block` | GET → cache. Écritures → file d'attente |
| **Folios & Transactions** | `foglioApi.ts`, `creditLedger.ts`, `paymentMethodApi.ts`, `rateTypeApi.ts` | `folio`, `folio_transaction`, `payment_method`, `rate_type` | GET → cache. Écritures → file d'attente |
| **Dashboard** | `dashboard.ts` | `dashboard` | GET → cache |
| **Hôtel** (lectures) | `hotelApi.ts` | `hotel` | GET → cache. `filterReservation` conserve son cache local avancé |
| **Hôtel (config)** | `hotelApi.ts` — `update*` | `hotel` | ❌ **En ligne uniquement** — configuration hôtel |
| **Notifications** | `notificationsApi.ts`, `notificationsStream.ts` | `notification` | GET → cache. SSE (stream) conserve EventSource direct |
| **Utilisateurs / Staff** | `userApi.ts`, `departmentApi.ts` | `user`, `department` | GET → cache. Écritures → file d'attente (sauf `signOut` qui reste direct) |
| **Compagnies** | `companyApi.ts` | `company` | GET → cache. Écritures → file d'attente. Export blob reste direct |
| **Audit Trail** | `auditTrail.ts` | `audit_trail` | GET → cache. Écritures → file d'attente. Export blob reste direct |
| **Objets perdus/trouvés** | `lostfound.ts` | `lost_found` | GET → cache. Écritures → file d'attente |
| **Night Audit** | `nightAudit.ts` | `night_audit` | GET → cache. Écritures → file d'attente (priorité 10) |
| **Transport** | `transportationRequest.ts` | `transportation` | Écritures → file d'attente |
| **WhatsApp** | `whatsapp.ts` | `whatsapp` | ❌ **En ligne uniquement** — API externe Meta |
| **Work Orders** | `workOrderApi.ts` | `work_order` | GET → cache. Écritures → file d'attente |
| **Satisfaction** | `satisfactionService.ts` | `satisfaction` | GET → cache |

## ❌ Services qui restent exclusivement en ligne

Ces domaines ne sont pas compatibles avec le mode offline car ils nécessitent des données temps réel, des autorisations fraîches, ou produisent des données trop volumineuses pour un cache local pertinent :

| Domaine | Fichiers exclus | Raison |
|---------|----------------|--------|
| **Cashiering** | `ExchangeRate*`, `NewPaymentCityLedger`, `PosInterface` | Opérations financières temps réel, intégrité des paiements |
| **Configuration** | `configrationApi.ts` et toutes les vues sous Configuration/ | Paramètres hôtel, une seule source de vérité nécessaire |
| **Reports** | `frontOfficeReport.ts`, `occupancyReportsApi.ts`, `workOrderReportsApi.ts`, `reportsApi.ts` | Données agrégées volumineuses, pas de cache pertinent |
| **Channel Manager** | `channelManagerApi.ts`, `channexBookingProcessor.ts` | Sync temps réel avec les OTA (Booking.com, Expedia, etc.) |
| **Market Place** | `marketPlaceApi.ts` | Place de marché externe, nécessite connexion |
| **Authentification** | `signOut()` dans `userApi.ts`, `api.ts` (logout) | Auth/déconnexion, ne s'utilise pas offline |

## 📋 Priorités de la file d'attente offline

Chaque opération se voit attribuer une priorité qui détermine son ordre de synchronisation :

| Priorité | Usage | Exemples |
|----------|-------|----------|
| **10** (Critique) | Opérations qui impactent immédiatement l'exploitation | Check-in/out, Night Audit, Toggle offline mode |
| **7** (Haute) | CRUD sur données métier principales | Création réservation, assignation chambre, transactions folio, work orders, compagnies |
| **5** (Normale) | Opérations secondaires ou non bloquantes | Discounts, Lost & Found, WhatsApp test, Notifications read, Transportation |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                 Composants Vue                   │
├─────────────────────────────────────────────────┤
│              Services API (offline-aware)        │
├─────────────────────────────────────────────────┤
│                  apiProxy.ts                     │
│          (offlineAwareApiCall)                   │
├──────────────────┬──────────────────────────────┤
│   En ligne ?     │         Hors ligne ?          │
│   ↓ apiClient    │         ↓                     │
│   (axios)        │   ┌──────────────────┐       │
│                  │   │ GET → Cache       │       │
│   Cache réponse  │   │ (IndexedDB)       │       │
│   (IndexedDB)    │   │ POST/PUT/DELETE   │       │
│                  │   │ → File d'attente  │       │
│                  │   └──────────────────┘       │
└──────────────────┴──────────────────────────────┘
```

## 🔄 Synchronisation

Le `SyncManager` (dans `src/services/offline/syncManager.ts`) gère :
1. **Push** : envoie les opérations en file d'attente au backend
2. **Pull** : récupère les données modifiées depuis le backend
3. **Initial Load** : charge les données de départ pour le mode offline
4. **Conflits** : détectés par le backend, résolus via `ConflictResolutionModal`

Voir aussi : `syncApi.ts` pour les endpoints dédiés (GET/POST `/api/sync/conflicts`).

---

*Document généré le 30 juin 2026*
