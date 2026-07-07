/**
 * Dexie.js Database for Offline Mode
 *
 * Version 2 — Tables métier dédiées (miroir de la base PostgreSQL)
 *
 * Fournit un stockage IndexedDB structuré avec :
 * - Tables dédiées pour chaque entité métier (réservations, clients, folios, etc.)
 * - Tables système (apiCache, syncQueue, drafts, checkpoints)
 * - Index optimisés pour les requêtes offline fréquentes
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CONVENTION DE NOMMAGE :
 * - Les noms de tables sont en camelCase (ex: folioTransactions)
 * - Les noms de champs sont en camelCase (ex: hotelId, reservationStatus)
 * - Le champ `id` est la clé primaire (number = ID serveur, string = ID temporaire)
 * - Le champ `_pending` indique une donnée en attente de synchronisation
 * - Le champ `_operationId` référence l'opération dans la queue
 * ═══════════════════════════════════════════════════════════════════════════
 */
import Dexie, { type EntityTable } from 'dexie'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — Entités Métier
// ═══════════════════════════════════════════════════════════════════════════

// ── Réservations ─────────────────────────────────────────────────────────

export interface OfflineReservation {
  id: number | string
  hotelId: number
  guestId?: number | null
  primaryRoomTypeId?: number
  scheduledArrivalDate?: string
  scheduledDepartureDate?: string
  actualArrivalDatetime?: string | null
  actualDepartureDatetime?: string | null
  reservationStatus?: string
  numAdultsTotal?: number
  numChildrenTotal?: number
  bookingSourceId?: number
  ratePlanId?: number
  discountId?: number | null
  totalEstimatedRevenue?: number
  specialNotes?: string | null
  confirmationCode?: string
  reservationNumber?: string | null
  customerType?: string | null
  sourceOfBusiness?: string | null
  businessSourceId?: number | null
  marketCodeId?: number | null
  paymentMethodId?: number | null
  totalAmount?: number
  discountAmount?: number
  taxAmount?: number
  finalAmount?: number
  paidAmount?: number
  remainingAmount?: number
  paymentStatus?: string
  currencyCode?: string | null
  groupId?: number | null
  taxExempt?: boolean
  cancellationReason?: string | null
  userId?: number
  createdBy?: number | null
  lastModifiedBy?: number | null
  version: number
  isHold?: boolean
  arrivedDate?: string | null
  departDate?: string | null
  numberOfNights?: number | null
  reservationDatetime?: string
  numberOfSeats?: number | null
  companyName?: string | null
  groupName?: string | null
  comment?: string
  // Champs de suivi offline
  _pending?: boolean
  _operationId?: string
  _tempId?: boolean
  createdAt: string
  updatedAt: string
}

// ── Chambres réservées ───────────────────────────────────────────────────

export interface OfflineReservationRoom {
  id: number | string
  reservationId: number | string
  roomId: number
  roomTypeId?: number
  checkInDate?: string
  checkOutDate?: string
  guestCount?: number
  roomRate?: number
  currency?: string
  status?: string
  isPrimary?: boolean
  guestId?: number | null
  version?: number
  _pending?: boolean
  _operationId?: string
  createdAt: string
  updatedAt: string
}

// ── Clients ──────────────────────────────────────────────────────────────

export interface OfflineGuest {
  id: number | string
  hotelId: number
  guestCode?: string
  firstName: string
  lastName?: string | null
  middleName?: string
  title?: string
  email?: string | null
  phonePrimary?: string
  phoneSecondary?: string
  phoneWhatsapp?: string | null
  nationality?: string
  placeOfBirth?: string
  dateOfBirth?: string | null
  gender?: string
  idType?: string
  idNumber?: string
  idExpiryDate?: string | null
  passportNumber?: string | null
  passportExpiry?: string | null
  address?: string
  addressLine?: string
  city?: string
  stateProvince?: string
  country?: string
  postalCode?: string
  companyId?: number | null
  companyName?: string
  jobTitle?: string
  vipStatusId?: number | null
  vipStatus?: string
  blacklisted?: boolean
  blacklistReason?: string
  specialRequests?: string
  dietaryRestrictions?: string
  notes?: string
  preferences?: object | null
  communicationPreferences?: object | null
  marketingOptIn?: boolean
  createdBy?: number
  lastModifiedBy?: number
  version: number
  _pending?: boolean
  _operationId?: string
  _tempId?: boolean
  createdAt: string
  updatedAt: string
}

// ── Folios (Facturation) ─────────────────────────────────────────────────

export interface OfflineFolio {
  id: number | string
  hotelId: number
  guestId?: number | null
  reservationId?: number | null
  reservationRoomId?: number | null
  folioNumber: string
  folioName?: string
  folioType: string
  status: string
  settlementStatus: string
  openedDate: string
  closedDate?: string | null
  openedBy: number
  closedBy?: number | null
  totalCharges: number
  totalPayments: number
  totalTaxes: number
  totalDiscounts: number
  balance: number
  currencyCode?: string
  roomCharges?: number
  foodBeverageCharges?: number
  telephoneCharges?: number
  laundryCharges?: number
  minibarCharges?: number
  spaCharges?: number
  parkingCharges?: number
  miscellaneousCharges?: number
  depositAmount?: number
  advancePayment?: number
  refundAmount?: number
  paymentMethod?: string | null
  invoiceNumber?: string | null
  createdBy?: number
  lastModifiedBy?: number
  version: number
  _pending?: boolean
  _operationId?: string
  _tempId?: boolean
  createdAt: string
  updatedAt: string
}

// ── Transactions Financières ─────────────────────────────────────────────

export interface OfflineFolioTransaction {
  id: number | string
  hotelId: number
  folioId: number | string
  transactionNumber?: number
  transactionType: string
  category?: string
  description?: string
  amount: number
  totalAmount?: number
  balance?: number
  taxAmount?: number
  netAmount?: number
  transactionDate: string
  paymentMethodId?: number
  paymentReference?: string
  reference?: string
  guestId?: number | null
  reservationId?: number | null
  revenueCenter?: string
  departmentCode?: string
  notes?: string
  isVoided?: boolean
  voidedBy?: number | null
  voidReason?: string | null
  status: string
  extraChargeId?: number | null
  mealPlanId?: number | null
  createdBy?: number
  lastModifiedBy?: number
  version: number
  _pending?: boolean
  _operationId?: string
  _tempId?: boolean
  createdAt: string
  updatedAt: string
}

// ── Chambres ─────────────────────────────────────────────────────────────

export interface OfflineRoom {
  id: number | string
  hotelId: number
  roomTypeId: number
  roomNumber: string
  floorNumber?: number
  status: string
  housekeepingStatus: string
  description?: string
  features?: object | null
  maxOccupancy?: number
  bedTypeId?: number
  sortKey?: number
  viewType?: string
  smokingAllowed?: boolean
  petFriendly?: boolean
  accessible?: boolean
  images?: string[]
  shortCode?: string | null
  createdBy?: number
  lastModifiedBy?: number
  version: number
  _pending?: boolean
  _operationId?: string
  createdAt: string
  updatedAt: string
}

// ── Types de Chambres ────────────────────────────────────────────────────

export interface OfflineRoomType {
  id: number
  hotelId: number
  roomTypeName: string
  shortCode: string
  baseAdult: number
  baseChild: number
  maxAdult: number
  maxChild: number
  color?: string
  sortOrder?: number
  publishToWebsite?: boolean
  defaultWebInventory?: number
  roomAmenities?: number[] | null
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

// ── Tarifs ───────────────────────────────────────────────────────────────

export interface OfflineRoomRate {
  id: number
  roomTypeId: number
  rateTypeId?: number
  rateDate: string
  rateAmount: number
  currency?: string
  minStay?: number
  closedToArrival?: boolean
  closedToDeparture?: boolean
  stopSell?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineRateType {
  id: number
  hotelId: number
  name: string
  shortCode?: string
  description?: string
  color?: string
  isDefault?: boolean
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

// ── Configuration (références) ──────────────────────────────────────────

export interface OfflineBookingSource {
  id: number
  hotelId: number
  name: string
  commission?: number
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflinePaymentMethod {
  id: number
  hotelId: number
  name: string
  code?: string
  isActive: boolean
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface OfflineTaxRate {
  id: number
  hotelId: number
  name: string
  rate: number
  type?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineExtraCharge {
  id: number
  hotelId: number
  name: string
  amount: number
  type: string
  isActive?: boolean
  isTaxable?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineDiscount {
  id: number
  hotelId: number
  name: string
  type: string
  value: number
  applyOn?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineVipStatus {
  id: number
  hotelId: number
  name: string
  color?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface OfflineBlackListReason {
  id: number
  hotelId: number
  reason: string
  category?: string
  createdAt: string
  updatedAt: string
}

export interface OfflineBusinessSource {
  id: number
  hotelId: number
  name: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineMarketCode {
  id: number
  hotelId: number
  code: string
  description?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineReservationType {
  id: number
  hotelId: number
  name: string
  shortCode?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

// ── Opérations métier supplémentaires ────────────────────────────────────

export interface OfflineRoomBlock {
  id: number | string
  hotelId: number
  roomId: number
  startDate: string
  endDate: string
  reason?: string
  isActive?: boolean
  createdBy?: number
  version?: number
  _pending?: boolean
  _operationId?: string
  createdAt: string
  updatedAt: string
}

export interface OfflineWorkOrder {
  id: number | string
  hotelId: number
  roomId?: number
  title: string
  description?: string
  status: string
  priority?: string
  assignedTo?: number | null
  createdBy?: number
  version?: number
  _pending?: boolean
  _operationId?: string
  createdAt: string
  updatedAt: string
}

export interface OfflineAnnouncement {
  id: number
  title: string
  message: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OfflineNotification {
  id: number
  hotelId: number
  recipientType: string
  recipientId?: number
  title: string
  message: string
  type?: string
  isRead?: boolean
  relatedEntityType?: string
  relatedEntityId?: number
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — Système (Queue, Checkpoints, Drafts, Cache, Conflits)
// ═══════════════════════════════════════════════════════════════════════════

// ── Cache générique (rétrocompatibilité) ─────────────────────────────────

export interface CachedResponse {
  id?: number
  key: string
  data: any
  cachedAt: number
  ttl: number
}

// ── File d'attente ──────────────────────────────────────────────────────

export interface SyncOperation {
  id?: number
  operationId: string
  operationType: 'create' | 'update' | 'delete'
  resourceType: string
  resourceId?: number | null
  payload: Record<string, any>
  priority: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  clientTimestamp: string
  retryCount: number
  maxRetries: number
  errorMessage?: string | null
  createdAt: number
}

// ── Brouillons de formulaires ───────────────────────────────────────────

export interface Draft {
  id?: number
  key: string
  data: Record<string, any>
  updatedAt: number
}

// ── Points de synchro ───────────────────────────────────────────────────

export interface SyncCheckpoint {
  id?: number
  hotelId: number
  resourceType: string
  lastSyncVersion: number
  lastSyncAt: number
}

// ── Conflits stockés localement ──────────────────────────────────────────

export interface OfflineConflict {
  id?: number
  operationId: string
  resourceType: string
  resourceId: number | string
  clientVersion: number
  serverVersion: number
  clientData: any
  serverData: any
  resolution: 'pending' | 'client_wins' | 'server_wins'
  createdAt: number
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHÉMA INDEXEDDB — Version 2
// ═══════════════════════════════════════════════════════════════════════════

class OfflineDatabase extends Dexie {
  // ── Tables Système (rétrocompatibilité v1) ──
  apiCache!: EntityTable<CachedResponse, 'id'>
  syncQueue!: EntityTable<SyncOperation, 'id'>
  drafts!: EntityTable<Draft, 'id'>
  checkpoints!: EntityTable<SyncCheckpoint, 'id'>

  // ── Tables Métier — Données critiques (lecture/écriture offline) ──
  reservations!: EntityTable<OfflineReservation, 'id'>
  reservationRooms!: EntityTable<OfflineReservationRoom, 'id'>
  guests!: EntityTable<OfflineGuest, 'id'>
  folios!: EntityTable<OfflineFolio, 'id'>
  folioTransactions!: EntityTable<OfflineFolioTransaction, 'id'>
  rooms!: EntityTable<OfflineRoom, 'id'>
  roomBlocks!: EntityTable<OfflineRoomBlock, 'id'>
  workOrders!: EntityTable<OfflineWorkOrder, 'id'>

  // ── Tables Métier — Configuration (lecture seule offline) ──
  roomTypes!: EntityTable<OfflineRoomType, 'id'>
  roomRates!: EntityTable<OfflineRoomRate, 'id'>
  rateTypes!: EntityTable<OfflineRateType, 'id'>
  bookingSources!: EntityTable<OfflineBookingSource, 'id'>
  paymentMethods!: EntityTable<OfflinePaymentMethod, 'id'>
  taxRates!: EntityTable<OfflineTaxRate, 'id'>
  extraCharges!: EntityTable<OfflineExtraCharge, 'id'>
  discounts!: EntityTable<OfflineDiscount, 'id'>
  vipStatuses!: EntityTable<OfflineVipStatus, 'id'>
  blackListReasons!: EntityTable<OfflineBlackListReason, 'id'>
  businessSources!: EntityTable<OfflineBusinessSource, 'id'>
  marketCodes!: EntityTable<OfflineMarketCode, 'id'>
  reservationTypes!: EntityTable<OfflineReservationType, 'id'>
  announcements!: EntityTable<OfflineAnnouncement, 'id'>
  notifications!: EntityTable<OfflineNotification, 'id'>

  // ── Tables Métier — Conflits locaux ──
  conflicts!: EntityTable<OfflineConflict, 'id'>

  constructor() {
    super('EnjoyPMSOffline')

    // Version 1 (existante) — conservée pour la compatibilité ascendante
    this.version(1).stores({
      apiCache: '++id, key, cachedAt',
      syncQueue: '++id, operationId, status, priority, createdAt',
      drafts: '++id, key',
      checkpoints: '++id, [hotelId+resourceType]',
    })

    // Version 2 — Tables métier dédiées
    this.version(2).stores({
      // Tables système (conservées)
      apiCache: '++id, key, cachedAt',
      syncQueue: '++id, operationId, status, priority, createdAt, resourceType',
      drafts: '++id, key, updatedAt',
      checkpoints: '++id, [hotelId+resourceType], hotelId, resourceType',

      // Tables métier — Données critiques
      reservations: 'id, hotelId, reservationStatus, scheduledArrivalDate, scheduledDepartureDate, guestId, version, _pending, updatedAt',
      reservationRooms: 'id, reservationId, roomId, version, _pending, updatedAt',
      guests: 'id, hotelId, firstName, lastName, email, phonePrimary, version, _pending, updatedAt',
      folios: 'id, hotelId, guestId, reservationId, status, folioType, balance, version, _pending, updatedAt',
      folioTransactions: 'id, hotelId, folioId, transactionType, transactionDate, amount, version, _pending, updatedAt',
      rooms: 'id, hotelId, roomTypeId, status, housekeepingStatus, roomNumber, version, _pending, updatedAt',
      roomBlocks: 'id, hotelId, roomId, startDate, endDate, version, _pending, updatedAt',
      workOrders: 'id, hotelId, roomId, status, version, _pending, updatedAt',

      // Tables métier — Configuration
      roomTypes: 'id, hotelId, roomTypeName, isDeleted, sortOrder',
      roomRates: 'id, roomTypeId, rateTypeId, rateDate, rateAmount',
      rateTypes: 'id, hotelId, name, isDefault',
      bookingSources: 'id, hotelId, name, isActive',
      paymentMethods: 'id, hotelId, name, isActive',
      taxRates: 'id, hotelId, name, isActive',
      extraCharges: 'id, hotelId, name, type',
      discounts: 'id, hotelId, name, type, isActive',
      vipStatuses: 'id, hotelId, name',
      blackListReasons: 'id, hotelId, reason',
      businessSources: 'id, hotelId, name',
      marketCodes: 'id, hotelId, code',
      reservationTypes: 'id, hotelId, name',
      announcements: 'id, isActive',
      notifications: 'id, hotelId, recipientType, isRead',

      // Conflits stockés localement
      conflicts: '++id, resourceType, resolution, createdAt',
    })
  }
}

export const db = new OfflineDatabase()

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — Cache générique (rétrocompatibilité)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Met en cache une réponse API générique (ancien système)
 * @deprecated Utiliser OfflineCacheService.set() pour les nouvelles implémentations
 */
export async function cacheApiResponse(
  key: string,
  data: any,
  ttl: number = 5 * 60 * 1000
): Promise<void> {
  await db.apiCache.where('key').equals(key).delete()
  await db.apiCache.add({ key, data, cachedAt: Date.now(), ttl })
}

/**
 * Récupère une réponse API générique depuis le cache
 * @deprecated Utiliser OfflineCacheService.get() pour les nouvelles implémentations
 */
export async function getCachedResponse<T = any>(
  key: string,
  maxStale: number = 0
): Promise<{ data: T; stale: boolean } | null> {
  const entry = await db.apiCache.where('key').equals(key).first()
  if (!entry) return null

  const age = Date.now() - entry.cachedAt
  if (age <= entry.ttl) {
    return { data: entry.data as T, stale: false }
  }
  if (maxStale > 0 && age <= entry.ttl + maxStale) {
    return { data: entry.data as T, stale: true }
  }
  await db.apiCache.where('key').equals(key).delete()
  return null
}

/**
 * Vide les entrées de cache expirées
 */
export async function clearExpiredCache(): Promise<number> {
  const now = Date.now()
  return db.apiCache.filter((e) => now > e.cachedAt + e.ttl).delete()
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — File d'attente (Queue)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ajoute une opération à la file d'attente
 */
export async function queueOperation(
  op: Omit<SyncOperation, 'id' | 'createdAt' | 'status' | 'retryCount'>
): Promise<number> {
  const id = await db.syncQueue.add({
    ...op,
    status: 'pending',
    retryCount: 0,
    createdAt: Date.now(),
  })
  return id ?? 0
}

/**
 * Récupère les opérations en attente (triées par priorité puis date)
 */
export async function getPendingOperations(): Promise<SyncOperation[]> {
  const items = await db.syncQueue
    .where('status').equals('pending')
    .toArray()
  return items.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt)
}

/**
 * Marque une opération comme complétée
 */
export async function markOperationCompleted(operationId: string): Promise<void> {
  await db.syncQueue.where('operationId').equals(operationId).modify({ status: 'completed' })
}

/**
 * Marque une opération comme échouée (avec gestion des tentatives)
 */
export async function markOperationFailed(operationId: string, error: string): Promise<void> {
  const entry = await db.syncQueue.where('operationId').equals(operationId).first()
  if (!entry) return
  const newRetryCount = (entry.retryCount || 0) + 1
  const status = newRetryCount >= entry.maxRetries ? 'failed' : 'pending'
  await db.syncQueue.where('operationId').equals(operationId).modify({
    status,
    retryCount: newRetryCount,
    errorMessage: error,
  })
}

/**
 * Statistiques de la file d'attente
 */
export async function getQueueStats(): Promise<{
  pending: number
  processing: number
  completed: number
  failed: number
}> {
  const all = await db.syncQueue.toArray()
  return {
    pending: all.filter((o) => o.status === 'pending').length,
    processing: all.filter((o) => o.status === 'processing').length,
    completed: all.filter((o) => o.status === 'completed').length,
    failed: all.filter((o) => o.status === 'failed').length,
  }
}

/**
 * Supprime les opérations complétées de la file
 */
export async function clearCompletedOperations(): Promise<void> {
  await db.syncQueue.where('status').equals('completed').delete()
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — Brouillons (Drafts)
// ═══════════════════════════════════════════════════════════════════════════

export async function saveDraft(key: string, data: Record<string, any>): Promise<void> {
  await db.drafts.put({ key, data, updatedAt: Date.now() })
}

export async function loadDraft<T = Record<string, any>>(key: string): Promise<T | null> {
  const draft = await db.drafts.where('key').equals(key).first()
  return (draft?.data as T) ?? null
}

export async function deleteDraft(key: string): Promise<void> {
  await db.drafts.where('key').equals(key).delete()
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — Points de synchro (Checkpoints)
// ═══════════════════════════════════════════════════════════════════════════

export async function updateCheckpoint(
  hotelId: number,
  resourceType: string,
  lastSyncVersion: number
): Promise<void> {
  const existing = await db.checkpoints
    .where(['hotelId+resourceType']).equals([hotelId, resourceType]).first()
  if (existing) {
    await db.checkpoints.update(existing.id!, { lastSyncVersion, lastSyncAt: Date.now() })
  } else {
    await db.checkpoints.add({ hotelId, resourceType, lastSyncVersion, lastSyncAt: Date.now() })
  }
}

export async function getCheckpoint(hotelId: number, resourceType: string): Promise<number> {
  const cp = await db.checkpoints
    .where(['hotelId+resourceType']).equals([hotelId, resourceType]).first()
  return cp?.lastSyncVersion ?? 0
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — Mapping resourceType ↔ Table IndexedDB
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map entre les noms de resourceType (utilisés par l'API backend)
 * et les noms de tables IndexedDB.
 */
export function getTableForResource(resourceType: string): string | null {
  const map: Record<string, string> = {
    reservation: 'reservations',
    reservation_room: 'reservationRooms',
    guest: 'guests',
    folio: 'folios',
    folio_transaction: 'folioTransactions',
    room: 'rooms',
    room_type: 'roomTypes',
    rate_type: 'rateTypes',
    room_rate: 'roomRates',
    booking_source: 'bookingSources',
    payment_method: 'paymentMethods',
    tax_rate: 'taxRates',
    extra_charge: 'extraCharges',
    discount: 'discounts',
    vip_status: 'vipStatuses',
    black_list_reason: 'blackListReasons',
    business_source: 'businessSources',
    market_code: 'marketCodes',
    reservation_type: 'reservationTypes',
    room_block: 'roomBlocks',
    work_order: 'workOrders',
    announcement: 'announcements',
    notification: 'notifications',
  }
  return map[resourceType] ?? null
}

/**
 * Vérifie si une table IndexedDB accepte des IDs temporaires (string).
 */
export function tableSupportsTempIds(tableName: string): boolean {
  const tempIdTables = [
    'reservations', 'reservationRooms', 'guests',
    'folios', 'folioTransactions', 'rooms',
    'roomBlocks', 'workOrders',
  ]
  return tempIdTables.includes(tableName)
}
