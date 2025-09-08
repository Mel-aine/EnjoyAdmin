export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
  CANCELLED = 'cancelled',
  NOSHOW = 'no_show',
  VOIDED = 'voided'
}

export const getReservationStatusOptions = () => [
  { label: 'Pending', value: ReservationStatus.PENDING },
  { label: 'Confirmed', value: ReservationStatus.CONFIRMED },
  { label: 'Checked-in', value: ReservationStatus.CHECKED_IN },
  { label: 'Checked-out', value: ReservationStatus.CHECKED_OUT },
  { label: 'Cancelled', value: ReservationStatus.CANCELLED },
  { label: 'No-show', value: ReservationStatus.NOSHOW },
  { label: 'Voided', value: ReservationStatus.VOIDED }
]