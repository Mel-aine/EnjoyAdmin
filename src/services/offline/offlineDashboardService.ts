/**
 * OfflineDashboardService
 *
 * Construit les données du dashboard front-office directement depuis les tables
 * IndexedDB en reproduisant la logique du backend DashboardController.getFrontOfficeDashboard.
 *
 * Utilisé par FrontOfficeDashboard.vue quand l'utilisateur est hors ligne.
 */
import { db } from './db.js'
import type {
  OfflineReservation,
  OfflineRoom,
  OfflineRoomBlock,
  OfflineGuest,
  OfflineFolio,
  OfflineRoomType,
} from './db.js'

// ── Types (miroir du backend) ──────────────────────────────────────────

interface ArrivalData {
  pending: number
  arrived: number
  total: number
}

interface DepartureData {
  pending: number
  checkedOut: number
  total: number
}

interface GuestInHouseData {
  adult: number
  child: number
  total: number
  totalGuests: number
  averageGuestsPerRoom: number
}

interface RoomStatusData {
  vacant: number
  sold: number
  dayUse: number
  complimentary: number
  blocked: number
  blockedForDate: number
  total: number
  occupancyRate: number
  availableRooms: number
}

interface SuiteOccupancy {
  roomTypeId: number
  roomTypeName: string
  totalRooms: number
  occupied: number
  free: number
  occupancyRate: string
}

interface HousekeepingStatusData {
  clean: number
  inspected: number
  dirty: number
  blocked: number
  toClean: number
  cleanPercentage: number
  total: number
}

interface UnpaidFolioItem {
  folioNumber: string
  id: number | string
  guestName: string
  balance: number
}

interface OfflineDashboardResponse {
  arrival: ArrivalData
  departure: DepartureData
  guestInHouse: GuestInHouseData
  roomStatus: RoomStatusData
  suites: SuiteOccupancy[]
  housekeepingStatus: HousekeepingStatusData
  unpaidFoliosData: {
    unpaidFolios: {
      total: number
      foliosList: UnpaidFolioItem[]
    }
  }
  activityFeeds: any[]
}

// ── Helpers ────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

// ── Service principal ──────────────────────────────────────────────────

export async function computeOfflineDashboardData(
  hotelId: number
): Promise<OfflineDashboardResponse> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today)

  // ── 1. Charger toutes les données depuis IndexedDB ──────────────

  const [
    allReservations,
    allReservationRooms,
    allRooms,
    allRoomTypes,
    allRoomBlocks,
    allFolios,
    allGuests,
  ] = await Promise.all([
    db.reservations.where('hotelId').equals(hotelId).toArray(),
    db.reservationRooms.toArray(),
    db.rooms.where('hotelId').equals(hotelId).toArray(),
    db.roomTypes.where('hotelId').equals(hotelId).filter((rt) => !rt.isDeleted).toArray(),
    db.roomBlocks.where('hotelId').equals(hotelId).toArray(),
    db.folios.where('hotelId').equals(hotelId).toArray(),
    db.guests.where('hotelId').equals(hotelId).toArray(),
  ])

  // Indexes
  const guestMap = new Map<number | string, OfflineGuest>()
  for (const g of allGuests) guestMap.set(g.id, g)

  const resRoomByReservation = new Map<number | string, any[]>()
  for (const rr of allReservationRooms) {
    const rid = rr.reservationId
    if (!resRoomByReservation.has(rid)) resRoomByReservation.set(rid, [])
    resRoomByReservation.get(rid)!.push(rr)
  }

  const roomMap = new Map<number | string, OfflineRoom>()
  for (const r of allRooms) roomMap.set(r.id, r)

  const roomTypeMap = new Map<number, OfflineRoomType>()
  for (const rt of allRoomTypes) roomTypeMap.set(rt.id, rt)

  // ── 2. Arrivals (réservations avec arrived_date = today, status = confirmed ou checked_in)
  const arrivingReservations = allReservations.filter(
    (r) =>
      r.scheduledArrivalDate === todayStr &&
      r.reservationStatus &&
      ['confirmed', 'checked_in'].includes(r.reservationStatus)
  )
  const arrivalPending = arrivingReservations.filter((r) => r.reservationStatus === 'confirmed').length
  const arrivalArrived = arrivingReservations.filter((r) => r.reservationStatus === 'checked_in').length
  const arrival: ArrivalData = {
    pending: arrivalPending,
    arrived: arrivalArrived,
    total: arrivalArrived + arrivalPending,
  }

  // ── 3. Departures (réservations avec depart_date = today, status = checked_in ou checked_out)
  const departingReservations = allReservations.filter(
    (r) =>
      r.scheduledDepartureDate === todayStr &&
      r.reservationStatus &&
      ['checked_in', 'checked_out'].includes(r.reservationStatus)
  )
  const departurePending = departingReservations.filter((r) => r.reservationStatus === 'checked_in').length
  const departureCheckedOut = departingReservations.filter((r) => r.reservationStatus === 'checked_out').length
  const departure: DepartureData = {
    pending: departurePending,
    checkedOut: departureCheckedOut,
    total: departureCheckedOut + departurePending,
  }

  // ── 4. Guest in house (checked_in, arrived <= today, depart >= today)
  const inHouseReservations = allReservations.filter(
    (r) =>
      r.reservationStatus === 'checked_in' &&
      r.scheduledArrivalDate &&
      r.scheduledDepartureDate &&
      r.scheduledArrivalDate <= todayStr &&
      r.scheduledDepartureDate >= todayStr
  )
  let totalAdults = 0
  let totalChildren = 0
  for (const r of inHouseReservations) {
    totalAdults += r.numAdultsTotal || 0
    totalChildren += r.numChildrenTotal || 0
  }
  const inHouseRooms = inHouseReservations.length
  const totalGuests = totalAdults + totalChildren
  const guestInHouse: GuestInHouseData = {
    adult: totalAdults,
    child: totalChildren,
    total: inHouseRooms,
    totalGuests,
    averageGuestsPerRoom: inHouseRooms > 0 ? Math.round((totalGuests / inHouseRooms) * 100) / 100 : 0,
  }

  // ── 5. Room status (today)
  // Occupied rooms: reservationRooms with status=checked_in, checkInDate<=today, checkOutDate>today
  const occupiedRoomIds = new Set<number | string>()
  for (const r of allReservations) {
    if (r.reservationStatus !== 'checked_in') continue
    if (!r.scheduledArrivalDate || !r.scheduledDepartureDate) continue
    if (!(r.scheduledArrivalDate <= todayStr && r.scheduledDepartureDate > todayStr)) continue
    const rRooms = resRoomByReservation.get(r.id) || []
    for (const rr of rRooms) {
      if (rr.roomId && rr.status === 'checked_in') {
        const ci = rr.checkInDate
        const co = rr.checkOutDate
        if (ci && co && ci <= todayStr && co > todayStr) {
          occupiedRoomIds.add(rr.roomId)
        }
      }
    }
  }

  // Day use: reservations with check_in_date = today and check_out_date = today, confirmed
  const dayUseCount = allReservations.filter(
    (r) =>
      r.scheduledArrivalDate === todayStr &&
      r.scheduledDepartureDate === todayStr &&
      r.reservationStatus === 'confirmed'
  ).length

  // Complimentary (not available in offline data - we skip this)
  const complimentaryCount = 0

  // Blocked rooms (from room_blocks)
  const blockedRoomIds = new Set<number | string>()
  for (const block of allRoomBlocks) {
    if (block.startDate && block.endDate && block.startDate <= todayStr && block.endDate >= todayStr) {
      blockedRoomIds.add(block.roomId)
    }
  }

  const totalRooms = allRooms.length
  const occupiedCount = occupiedRoomIds.size
  const availableRooms = Math.max(0, totalRooms - occupiedCount - dayUseCount - complimentaryCount - blockedRoomIds.size)
  const occupiedTotal = occupiedCount + dayUseCount + complimentaryCount
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedTotal / totalRooms) * 100) : 0

  const roomStatus: RoomStatusData = {
    vacant: availableRooms,
    sold: occupiedCount,
    dayUse: dayUseCount,
    complimentary: complimentaryCount,
    blocked: blockedRoomIds.size,
    blockedForDate: blockedRoomIds.size,
    total: totalRooms,
    occupancyRate,
    availableRooms: availableRooms,
  }

  // ── 6. Suite occupancy by room type
  const roomsByType = new Map<number, OfflineRoom[]>()
  for (const room of allRooms) {
    if (room.roomTypeId) {
      if (!roomsByType.has(room.roomTypeId)) roomsByType.set(room.roomTypeId, [])
      roomsByType.get(room.roomTypeId)!.push(room)
    }
  }

  const suites: SuiteOccupancy[] = []
  const sortedRoomTypes = [...allRoomTypes].sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  for (const rt of sortedRoomTypes) {
    const roomsOfType = roomsByType.get(rt.id) || []
    const typeTotal = roomsOfType.length
    if (typeTotal === 0) continue

    let typeOccupied = 0
    for (const room of roomsOfType) {
      if (occupiedRoomIds.has(room.id) || blockedRoomIds.has(room.id)) {
        typeOccupied++
      }
    }

    const typeFree = Math.max(0, typeTotal - typeOccupied)
    const rate = typeTotal > 0 ? (typeOccupied / typeTotal) * 100 : 0

    suites.push({
      roomTypeId: rt.id,
      roomTypeName: rt.roomTypeName,
      totalRooms: typeTotal,
      occupied: typeOccupied,
      free: typeFree,
      occupancyRate: `${rate.toFixed(0)}%`,
    })
  }

  // ── 7. Housekeeping status
  const blockedRoomIdsSet = new Set<number | string>(blockedRoomIds)
  const hkCounts = { clean: 0, inspected: 0, dirty: 0, checkout: 0, other: 0 }

  for (const room of allRooms) {
    if (blockedRoomIdsSet.has(room.id)) continue
    const hk = room.housekeepingStatus || ''
    if (hk === 'clean') hkCounts.clean++
    else if (hk === 'inspected') hkCounts.inspected++
    else if (hk === 'dirty') hkCounts.dirty++
    else if (hk === 'checkout') hkCounts.checkout++
    else hkCounts.other++
  }

  const nonBlockedTotal = totalRooms - blockedRoomIdsSet.size
  const housekeepingStatus: HousekeepingStatusData = {
    clean: hkCounts.clean,
    inspected: hkCounts.inspected,
    dirty: hkCounts.dirty,
    blocked: blockedRoomIdsSet.size,
    toClean: hkCounts.dirty + hkCounts.checkout,
    cleanPercentage: nonBlockedTotal > 0 ? Math.round((hkCounts.clean / nonBlockedTotal) * 100) : 0,
    total: totalRooms,
  }

  // ── 8. Unpaid folios (balance > 0, status = 'open')
  const unpaidFolios = allFolios
    .filter((f) => f.status === 'open' && (f.balance || 0) > 0)
    .map((f) => {
      const guest = f.guestId ? guestMap.get(f.guestId) : null
      const guestName = guest
        ? `${guest.firstName} ${guest.lastName || ''}`.trim()
        : 'N/A'
      return {
        folioNumber: f.folioNumber || `#${f.id}`,
        id: f.id,
        guestName,
        balance: f.balance || 0,
      }
    })
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 20)

  const unpaidFoliosData = {
    unpaidFolios: {
      total: unpaidFolios.length,
      foliosList: unpaidFolios,
    },
  }

  // ── 9. Activity feeds (not available offline)
  const activityFeeds: any[] = []

  return {
    arrival,
    departure,
    guestInHouse,
    roomStatus,
    suites,
    housekeepingStatus,
    unpaidFoliosData,
    activityFeeds,
  }
}
