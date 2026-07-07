/**
 * OfflineCalendarService
 *
 * Construit la réponse daily-occupancy directement depuis les tables IndexedDB
 * en reproduisant la logique du backend HotelAnalyticsService.
 *
 * Utilisé par ReservationCalendar.vue quand l'utilisateur est hors ligne.
 * Évite de mettre en cache des blobs API — on recompute depuis les données brutes.
 */
import { db } from './db.js'
import type { OfflineReservation, OfflineRoom, OfflineRoomBlock, OfflineGuest } from './db.js'

// ── Types (miroir du backend) ──────────────────────────────────────────

interface RoomStatusStats {
  all: number
  vacant: number
  occupied: number
  reserved: number
  blocked: number
  dueOut: number
  dirty: number
}

interface AvailableRoomsByType {
  room_type_id: number
  room_type_name: string
  available_count: number
}

interface UnassignedRoomReservationsByType {
  room_type_id: number
  room_type_name: string
  unassigned_count: number
  unassigned_reservations: any[]
}

interface DailyMetric {
  date: string
  total_available_rooms: number
  occupancy_rate: number
  allocated_rooms: number
  unassigned_reservations: number
  room_status_stats: RoomStatusStats
  available_rooms_by_type: AvailableRoomsByType[]
  unassigned_room_reservations_by_type: UnassignedRoomReservationsByType[]
}

interface RoomDetail {
  room_number: string | null
  room_name: string
  room_type: string
  capacity: number
  room_id: number | string
  room_status: string
  room_housekeeping_status: string
  is_smoking: boolean
}

interface ReservationEntry {
  reservation_id: number | string
  guest_name: string
  check_in_date: string
  check_out_date: string
  reservation_status: string
  is_checking_in_today: boolean
  is_checking_out_today: boolean
  assigned_room_number: string | null
  room_id: number | string | null
  check_in_time: string
  check_out_time: string
  total_guests: number
  adults: number
  children: number
  special_requests: string
  reservation_number: string | null
  total_amount: number
  room_rate: number
  reservationType?: string
  customerType?: string
  companyName?: string
  groupName?: string
  remainingAmount?: number
  bookingSource?: any
  businessSource?: any
  totalNights?: number
  paymentStatus?: string
  balance_summary: any
  is_balance: boolean
  isWomen: boolean
  otaName?: string
  has_credit_transfer: boolean
}

interface GroupedRoomType {
  room_type: string
  order: number
  room_type_id: number
  total_rooms_of_type: number
  room_details: RoomDetail[]
  reservations: ReservationEntry[]
}

interface OfflineCalendarResponse {
  daily_occupancy_metrics: DailyMetric[]
  grouped_reservation_details: GroupedRoomType[]
  global_room_status_stats: RoomStatusStats
  room_blocks: any[]
}

// ── Helpers ────────────────────────────────────────────────────────────

function isWomanTitle(title: string | null | undefined): boolean {
  if (!title) return false
  const womenTitles = ['ms', 'mrs', 'miss', 'madam', 'madame', 'lady', 'dame', 'ms.', 'mrs.', 'miss.', 'girl', 'woman', 'women', 'female']
  return womenTitles.includes(title.toLowerCase().trim())
}

function getReservationStatus(reservation: OfflineReservation, todayStr: string): string {
  const status = reservation.reservationStatus || ''
  const depDate = reservation.scheduledDepartureDate || ''

  if (status === 'confirmed' || status === 'reserved') return 'confirmed'
  if (status === 'request') return 'request'
  if (status === 'blocked') return 'blocked'
  if (status === 'check_out' || status === 'checkout') return 'checkout'
  if (status === 'checked_in') {
    if (depDate === todayStr) return 'departure'
    return 'inhouse'
  }
  return status
}

function dateStrToDate(d: string | undefined | null): Date | null {
  if (!d) return null
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return null
  return parsed
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate
}

// ── Service principal ──────────────────────────────────────────────────

export async function computeOfflineCalendarData(
  hotelId: number,
  startDateStr: string,
  endDateStr: string
): Promise<OfflineCalendarResponse> {
  const startDate = new Date(startDateStr + 'T00:00:00')
  const endDate = new Date(endDateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  // ── 1. Charger toutes les données depuis IndexedDB ──────────────

  const [allRooms, roomTypes, allBlocks, allReservations, allReservationRooms, allGuests] =
    await Promise.all([
      db.rooms.where('hotelId').equals(hotelId).toArray(),
      db.roomTypes.where('hotelId').equals(hotelId).toArray(),
      db.roomBlocks.where('hotelId').equals(hotelId).toArray(),
      db.reservations
        .where('hotelId').equals(hotelId)
        .filter((r) => {
          // Filtrer les statuts exclus
          const excluded = ['cancelled', 'no-show', 'no_show', 'voided']
          if (r.reservationStatus && excluded.includes(r.reservationStatus)) return false
          // Vérifier le chevauchement de dates
          const arr = dateStrToDate(r.scheduledArrivalDate)
          const dep = dateStrToDate(r.scheduledDepartureDate)
          if (!arr || !dep) return false
          // (StartA <= EndB) and (EndA >= StartB)
          return arr <= endDate && dep >= startDate
        })
        .toArray(),
      db.reservationRooms.toArray(),
      db.guests.where('hotelId').equals(hotelId).toArray(),
    ])

  // Index des guests par id
  const guestMap = new Map<number | string, OfflineGuest>()
  for (const g of allGuests) {
    guestMap.set(g.id, g)
  }

  // Index des roomTypes par id
  const roomTypeMap = new Map<number, any>()
  for (const rt of roomTypes) {
    roomTypeMap.set(rt.id, rt)
  }

  // Index des reservationRooms par reservationId
  const resRoomMap = new Map<number | string, any[]>()
  for (const rr of allReservationRooms) {
    const rid = rr.reservationId
    if (!resRoomMap.has(rid)) {
      resRoomMap.set(rid, [])
    }
    resRoomMap.get(rid)!.push(rr)
  }

  // Index des rooms par id
  const roomMap = new Map<number | string, OfflineRoom>()
  for (const r of allRooms) {
    roomMap.set(r.id, r)
  }

  // ── 2. Calculer les stats globales des chambres ─────────────────

  const totalRooms = allRooms.length

  // Chambres statiquement bloquées ou hors service
  const staticBlockedOrOO = new Set<number | string>()
  const staticDirtyOrCleaning = new Set<number | string>()
  const roomTypeByRoomId = new Map<number | string, number>()
  const roomsByTypeTotal = new Map<number, number>()

  for (const room of allRooms) {
    if (room.roomTypeId) {
      roomTypeByRoomId.set(room.id, room.roomTypeId)
      roomsByTypeTotal.set(room.roomTypeId, (roomsByTypeTotal.get(room.roomTypeId) || 0) + 1)
    }
    if (
      room.status === 'blocked' ||
      room.status === 'out_of_order' ||
      room.status === 'maintenance' ||
      room.housekeepingStatus === 'out_of_order'
    ) {
      staticBlockedOrOO.add(room.id)
    }
    if (room.housekeepingStatus === 'dirty' || room.housekeepingStatus === 'cleaning') {
      staticDirtyOrCleaning.add(room.id)
    }
  }

  const staticExcludedByTypeCount = new Map<number, number>()
  for (const roomId of staticBlockedOrOO) {
    const typeId = roomTypeByRoomId.get(roomId)
    if (typeId !== undefined) {
      staticExcludedByTypeCount.set(typeId, (staticExcludedByTypeCount.get(typeId) || 0) + 1)
    }
  }

  // Trier les roomTypes
  const sortedRoomTypes = [...roomTypes].sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  // ── 3. Filtrer les blocks pour la période ───────────────────────

  const activeBlocks = allBlocks.filter((b) => {
    const from = dateStrToDate(b.startDate)
    const to = dateStrToDate(b.endDate)
    if (!from || !to) return false
    return (
      (from >= startDate && from <= endDate) ||
      (to >= startDate && to <= endDate) ||
      (from <= startDate && to >= endDate)
    )
  })

  // ── 4. Calculer les métriques quotidiennes ──────────────────────

  const dailyMetrics: DailyMetric[] = []

  for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
    const currentDate = new Date(dt)
    const currentDateStr = currentDate.toISOString().split('T')[0]

    // Réservations actives pour ce jour
    const activeReservations = allReservations.filter((r) => {
      const arr = dateStrToDate(r.scheduledArrivalDate)
      const dep = dateStrToDate(r.scheduledDepartureDate)
      if (!arr || !dep) return false
      return arr <= currentDate && dep > currentDate
    })

    const occupiedRoomIds = new Set<number | string>()
    let unassignedReservationsCount = 0
    let occupiedEffCount = 0

    for (const reservation of activeReservations) {
      let isAssignedForToday = false
      const rRooms = resRoomMap.get(reservation.id) || []

      for (const rr of rRooms) {
        const ci = rr.checkInDate
        const co = rr.checkOutDate
        if (ci && co && ci <= currentDateStr && co > currentDateStr) {
          if (rr.roomId) {
            occupiedRoomIds.add(rr.roomId)
            occupiedEffCount++
            isAssignedForToday = true
          }
        }
      }

      if (!isAssignedForToday && rRooms.length > 0) {
        unassignedReservationsCount++
      }
    }

    // Blocages actifs pour ce jour
    const blockedRoomIds = new Set<number | string>()
    for (const block of activeBlocks) {
      const from = block.startDate
      const to = block.endDate
      if (from && to && from <= currentDateStr && to >= currentDateStr) {
        blockedRoomIds.add(block.roomId)
      }
    }

    // Chambres disponibles
    const netTotalRooms = Math.max(0, totalRooms - blockedRoomIds.size)
    const occupancyRate = netTotalRooms > 0 ? (occupiedEffCount / netTotalRooms) * 100 : 0

    // Available rooms by type
    const availableRoomsByType: AvailableRoomsByType[] = sortedRoomTypes
      .filter((rt: any) => roomsByTypeTotal.has(rt.id))
      .map((rt: any) => ({
        room_type_id: rt.id,
        room_type_name: rt.roomTypeName,
        available_count: (roomsByTypeTotal.get(rt.id) || 0) - (staticExcludedByTypeCount.get(rt.id) || 0),
      }))

    // Soustraire les chambres réservées
    const reservedRoomIds = new Set<number | string>()
    for (const reservation of activeReservations) {
      const rRooms = resRoomMap.get(reservation.id) || []
      for (const rr of rRooms) {
        if (rr.roomId) {
          reservedRoomIds.add(rr.roomId)
        }
      }
    }

    for (const a of availableRoomsByType) {
      let subtractCount = 0
      for (const rid of reservedRoomIds) {
        const typeId = roomTypeByRoomId.get(rid)
        if (typeId === a.room_type_id) subtractCount++
      }
      for (const rid of blockedRoomIds) {
        const typeId = roomTypeByRoomId.get(rid)
        if (typeId === a.room_type_id) subtractCount++
      }
      a.available_count = Math.max(0, a.available_count - subtractCount)
    }

    // Unassigned by type
    const unassignedRoomReservationsByType: UnassignedRoomReservationsByType[] = sortedRoomTypes
      .filter((rt: any) => roomsByTypeTotal.has(rt.id))
      .map((rt: any) => ({
        room_type_id: rt.id,
        room_type_name: rt.roomTypeName,
        unassigned_count: 0,
        unassigned_reservations: [] as any[],
      }))

    const unassignedTypeMap = new Map<number, UnassignedRoomReservationsByType>()
    for (const u of unassignedRoomReservationsByType) {
      unassignedTypeMap.set(u.room_type_id, u)
    }

    for (const reservation of activeReservations) {
      const rRooms = resRoomMap.get(reservation.id) || []
      for (const rr of rRooms) {
        if (!rr.roomId && rr.roomTypeId) {
          const entry = unassignedTypeMap.get(rr.roomTypeId)
          if (entry) {
            entry.unassigned_count++
            const exists = entry.unassigned_reservations.some((r: any) => r.id === reservation.id)
            if (!exists) {
              entry.unassigned_reservations.push(reservation)
            }
          }
        }
      }
    }

    // Room status stats
    const checkingOutToday = activeReservations.filter((r) =>
      r.scheduledDepartureDate === currentDateStr && r.reservationStatus === 'checked_in'
    )
    const arrivingToday = activeReservations.filter((r) =>
      r.scheduledArrivalDate === currentDateStr && r.reservationStatus === 'confirmed'
    )

    const dueOutRooms = new Set<number | string>()
    for (const r of checkingOutToday) {
      const rRooms = resRoomMap.get(r.id) || []
      for (const rr of rRooms) {
        if (rr.roomId) dueOutRooms.add(rr.roomId)
      }
    }

    const arrivingRooms = new Set<number | string>()
    for (const r of arrivingToday) {
      const rRooms = resRoomMap.get(r.id) || []
      for (const rr of rRooms) {
        if (rr.roomId) arrivingRooms.add(rr.roomId)
      }
    }

    const roomStatusStats: RoomStatusStats = {
      all: totalRooms,
      vacant: 0,
      occupied: occupiedEffCount,
      reserved: 0,
      blocked: 0,
      dueOut: 0,
      dirty: 0,
    }

    for (const id of dueOutRooms) {
      if (occupiedRoomIds.has(id)) roomStatusStats.dueOut++
    }

    for (const id of arrivingRooms) {
      if (!occupiedRoomIds.has(id)) roomStatusStats.reserved++
    }

    const blockedSet = new Set(blockedRoomIds)
    for (const id of staticBlockedOrOO) blockedSet.add(id)

    for (const id of blockedSet) {
      if (!occupiedRoomIds.has(id) && !arrivingRooms.has(id)) roomStatusStats.blocked++
    }

    for (const id of staticDirtyOrCleaning) {
      if (!occupiedRoomIds.has(id) && !arrivingRooms.has(id) && !blockedSet.has(id))
        roomStatusStats.dirty++
    }

    roomStatusStats.vacant = Math.max(
      0,
      totalRooms -
        roomStatusStats.occupied -
        roomStatusStats.reserved -
        roomStatusStats.blocked -
        roomStatusStats.dirty
    )

    dailyMetrics.push({
      date: currentDateStr,
      total_available_rooms: netTotalRooms,
      occupancy_rate: parseFloat(occupancyRate.toFixed(0)),
      allocated_rooms: occupiedEffCount,
      unassigned_reservations: unassignedReservationsCount,
      room_status_stats: roomStatusStats,
      available_rooms_by_type: availableRoomsByType,
      unassigned_room_reservations_by_type: unassignedRoomReservationsByType,
    })
  }

  // ── 5. Grouper les réservations par type de chambre ────────────

  const groupedDetailsMap = new Map<string, GroupedRoomType>()

  for (const room of allRooms) {
    const rt = room.roomTypeId ? roomTypeMap.get(room.roomTypeId) : null
    const roomTypeName = rt?.roomTypeName || 'Uncategorized'
    const sortOrder = rt?.sortOrder ?? 0

    if (!groupedDetailsMap.has(roomTypeName)) {
      groupedDetailsMap.set(roomTypeName, {
        room_type: roomTypeName,
        order: sortOrder,
        room_type_id: rt?.id || 0,
        total_rooms_of_type: 0,
        room_details: [],
        reservations: [],
      })
    }

    const group = groupedDetailsMap.get(roomTypeName)!
    group.total_rooms_of_type++

    let roomStatus = 'Available'
    // Check if occupied today
    const isOccupiedToday = allReservations.some((r) => {
      const arr = dateStrToDate(r.scheduledArrivalDate)
      const dep = dateStrToDate(r.scheduledDepartureDate)
      if (!arr || !dep) return false
      if (!(arr <= today && dep > today)) return false
      const rRooms = resRoomMap.get(r.id) || []
      return rRooms.some((rr) => rr.roomId === room.id)
    })

    if (isOccupiedToday) {
      roomStatus = 'Occupied'
    } else if (room.status && room.status !== 'active') {
      roomStatus = room.status
    }

    group.room_details.push({
      room_number: room.roomNumber || null,
      room_name: room.roomNumber || '',
      room_type: roomTypeName,
      capacity: rt?.baseAdult || 0,
      room_id: room.id,
      room_status: roomStatus,
      room_housekeeping_status: room.housekeepingStatus || '',
      is_smoking: !!room.smokingAllowed,
    })
  }

  // Ajouter les réservations aux groupes
  for (const reservation of allReservations) {
    const guest = reservation.guestId ? guestMap.get(reservation.guestId) : null
    const rRooms = resRoomMap.get(reservation.id) || []

    if (rRooms.length > 0) {
      for (const rr of rRooms) {
        const rrRoom = rr.roomId ? roomMap.get(rr.roomId) : null
        const rrRoomType = rrRoom?.roomTypeId ? roomTypeMap.get(rrRoom.roomTypeId) : null
        const roomTypeName = rrRoomType?.roomTypeName || 'Uncategorized'

        let guestName = ''
        if (guest) {
          guestName = `${guest.title || ''} ${guest.firstName} ${guest.lastName || ''}`.trim()
        }

        if (groupedDetailsMap.has(roomTypeName)) {
          const group = groupedDetailsMap.get(roomTypeName)!
          const status = getReservationStatus(reservation, todayStr)

          group.reservations.push({
            reservation_id: reservation.id,
            guest_name: guestName,
            check_in_date: rr.checkInDate || reservation.scheduledArrivalDate || '',
            check_out_date: rr.checkOutDate || reservation.scheduledDepartureDate || '',
            reservation_status: status,
            is_checking_in_today: (rr.checkInDate || reservation.scheduledArrivalDate) === todayStr,
            is_checking_out_today: (rr.checkOutDate || reservation.scheduledDepartureDate) === todayStr,
            assigned_room_number: rrRoom?.roomNumber || null,
            room_id: rr.roomId || null,
            check_in_time: rr.checkInTime || '14:00',
            check_out_time: rr.checkOutTime || '12:00',
            total_guests: reservation.numAdultsTotal || 0,
            adults: reservation.numAdultsTotal || 0,
            children: reservation.numChildrenTotal || 0,
            special_requests: '',
            reservation_number: reservation.reservationNumber || null,
            total_amount: reservation.totalAmount || 0,
            room_rate: rr.roomRate || 0,
            customerType: reservation.customerType || undefined,
            companyName: reservation.companyName || undefined,
            groupName: reservation.groupName || undefined,
            remainingAmount: reservation.remainingAmount || 0,
            totalNights: reservation.numberOfNights || undefined,
            paymentStatus: reservation.paymentStatus || undefined,
            balance_summary: { totalChargesWithTaxes: 0, totalPayments: 0, outstandingBalance: 0 },
            is_balance: (reservation.remainingAmount || 0) > 0,
            isWomen: isWomanTitle(guest?.title || null),
            otaName: '',
            has_credit_transfer: false,
          })
        }
      }
    } else {
      // Réservation sans reservationRooms
      const guest = reservation.guestId ? guestMap.get(reservation.guestId) : null

      // Trouver le type de chambre principal de la réservation
      const primaryRoomType = reservation.primaryRoomTypeId
        ? roomTypeMap.get(reservation.primaryRoomTypeId)
        : null
      const roomTypeName = primaryRoomType?.roomTypeName || 'Uncategorized'

      let guestName = ''
      if (guest) {
        guestName = `${guest.title || ''} ${guest.firstName} ${guest.lastName || ''}`.trim()
      }

      if (groupedDetailsMap.has(roomTypeName)) {
        const group = groupedDetailsMap.get(roomTypeName)!
        const status = getReservationStatus(reservation, todayStr)

        group.reservations.push({
          reservation_id: reservation.id,
          guest_name: guestName,
          check_in_date: reservation.scheduledArrivalDate || '',
          check_out_date: reservation.scheduledDepartureDate || '',
          reservation_status: status,
          is_checking_in_today: reservation.scheduledArrivalDate === todayStr,
          is_checking_out_today: reservation.scheduledDepartureDate === todayStr,
          assigned_room_number: null,
          room_id: null,
          check_in_time: '14:00',
          check_out_time: '12:00',
          total_guests: reservation.numAdultsTotal || 0,
          adults: reservation.numAdultsTotal || 0,
          children: reservation.numChildrenTotal || 0,
          special_requests: '',
          reservation_number: reservation.reservationNumber || null,
          total_amount: reservation.totalAmount || 0,
          room_rate: 0,
          customerType: reservation.customerType || undefined,
          companyName: reservation.companyName || undefined,
          groupName: reservation.groupName || undefined,
          remainingAmount: reservation.remainingAmount || 0,
          totalNights: reservation.numberOfNights || undefined,
          paymentStatus: reservation.paymentStatus || undefined,
          balance_summary: { totalChargesWithTaxes: 0, totalPayments: 0, outstandingBalance: 0 },
          is_balance: (reservation.remainingAmount || 0) > 0,
          isWomen: isWomanTitle(guest?.title || null),
          otaName: '',
          has_credit_transfer: false,
        })
      }
    }
  }

  // Trier les groupes par ordre
  const groupedDetailsSorted = [...groupedDetailsMap.values()].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )

  // ── 6. Global room status stats ─────────────────────────────────

  const allCheckedIn = allReservations.filter((r) => r.reservationStatus === 'checked_in')

  let globalOccupiedCount = 0
  for (const r of allCheckedIn) {
    const arr = dateStrToDate(r.scheduledArrivalDate)
    const dep = dateStrToDate(r.scheduledDepartureDate)
    if (!arr || !dep) continue
    if (!(arr <= today && dep > today)) continue
    const rRooms = resRoomMap.get(r.id) || []
    for (const rr of rRooms) {
      if (rr.roomId) {
        const ci = rr.checkInDate
        const co = rr.checkOutDate
        if (ci && co && ci <= todayStr && co > todayStr) {
          globalOccupiedCount++
        }
      }
    }
  }

  const globalDueOutRoomIds = new Set<number | string>()
  for (const r of allCheckedIn) {
    const dep = dateStrToDate(r.scheduledDepartureDate)
    if (!dep) continue
    if (isSameDay(dep, today)) {
      const rRooms = resRoomMap.get(r.id) || []
      for (const rr of rRooms) {
        if (rr.roomId) {
          const co = rr.checkOutDate
          if (co && co <= todayStr) {
            globalDueOutRoomIds.add(rr.roomId)
          }
        }
      }
    }
  }

  const allConfirmedToday = allReservations.filter(
    (r) => r.reservationStatus === 'confirmed' && r.scheduledArrivalDate === todayStr
  )

  const confirmedRoomIds = new Set<number | string>()
  for (const r of allConfirmedToday) {
    const rRooms = resRoomMap.get(r.id) || []
    for (const rr of rRooms) {
      if (rr.roomId) confirmedRoomIds.add(rr.roomId)
    }
  }

  const allBlockedRoomIds = new Set<number | string>(staticBlockedOrOO)
  for (const block of activeBlocks) {
    allBlockedRoomIds.add(block.roomId)
  }

  const globalRoomStatusStats: RoomStatusStats = {
    all: totalRooms,
    vacant: 0,
    occupied: globalOccupiedCount,
    reserved: confirmedRoomIds.size,
    blocked: allBlockedRoomIds.size,
    dueOut: globalDueOutRoomIds.size,
    dirty: staticDirtyOrCleaning.size,
  }

  globalRoomStatusStats.vacant = Math.max(
    0,
    totalRooms -
      globalRoomStatusStats.occupied -
      globalRoomStatusStats.blocked -
      globalRoomStatusStats.dirty
  )

  // ── 7. Formater les room blocks ─────────────────────────────────

  const roomBlocks = activeBlocks.map((block) => {
    const room = block.roomId ? roomMap.get(block.roomId) : null
    const rt = room?.roomTypeId ? roomTypeMap.get(room.roomTypeId) : null
    return {
      id: block.id,
      block_from_date: block.startDate,
      block_to_date: block.endDate,
      reason: block.reason || '',
      status: 'blocked',
      room: room
        ? {
            id: room.id,
            room_number: room.roomNumber,
          }
        : null,
      room_type: rt
        ? {
            id: rt.id,
            name: rt.roomTypeName,
          }
        : null,
      created_at: block.createdAt,
      updated_at: block.updatedAt,
    }
  })

  return {
    daily_occupancy_metrics: dailyMetrics,
    grouped_reservation_details: groupedDetailsSorted,
    global_room_status_stats: globalRoomStatusStats,
    room_blocks: roomBlocks,
  }
}
