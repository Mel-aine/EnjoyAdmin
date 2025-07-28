export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export  enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}


export enum CONTRACTTYPE {
  CDI='cdi',
  CDD="cdd",
  SEASONAL="seasonal",
  APPRENTICESHIP="apprenticeship",
  TEMPORARY="temporary",
  INTERN="intern",

}