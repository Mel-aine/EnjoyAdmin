import type { Component } from 'vue'
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  StopCircle, 
  List, 
  X, 
  Eye, 
  Trash2, 
  UserMinus, 
  ArrowUpDown, 
  Pencil as PencilIcon
} from 'lucide-vue-next'
import RoomMoveIcon from '../icons/RoomMoveIcon.vue'
import ExchangeRoomIcon from '../icons/ExchangeRoomIcon.vue'
import UndoCheckInIcon from '../icons/UndoCheckInIcon.vue'
import UndoCheckOut from '../icons/UndoCheckOut.vue'

export class ActionIcons {
  // Centralized icon mapping for reservation and related actions
  private static readonly map: Record<string, Component> = {
    // Reservation actions
    check_in: CheckCircle,
    check_out: CheckCircle,
    add_payment: CreditCard,
    amend_stay: Calendar,
    room_move: RoomMoveIcon,
    exchange_room: ExchangeRoomIcon,
    stop_room_move: StopCircle,
    inclusion_list: List,
    cancel_reservation: X,
    no_show: Eye,
    void_reservation: Trash2,
    unassign_room: UserMinus,
    undo_check_in: UndoCheckInIcon,
    undo_check_out: UndoCheckOut,

    // Common actions used across views
    view: Eye,

    // Company details actions
    edit_company: PencilIcon,
    delete_company: Trash2,
    add_booking: Calendar,
    export_data: ArrowUpDown,
  }

  static getIcon(action: string): Component {
    return ActionIcons.map[action] ?? List
  }

  static getMap(): Record<string, Component> {
    return ActionIcons.map
  }
}