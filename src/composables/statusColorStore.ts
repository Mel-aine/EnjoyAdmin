import { defineStore } from 'pinia';

interface StatusColor {
  key: string;
  name: string;
  description: string;
  color: string;
}

export const useStatusColor = defineStore('statusColor', {
  state: () => ({
    statusColors: [] as StatusColor[],
  }),

  getters: {
    // Get color by status key
    getColorByKey: (state) => (key: string): string => {
      const statusColor = state.statusColors.find(sc => sc.key === key);
      return statusColor?.color || '#6B7280'; // Default gray color
    },

    // Get all status colors as a map for easier lookup
    statusColorMap: (state): Record<string, string> => {
      return state.statusColors.reduce((map, sc) => {
        map[sc.key] = sc.color;
        return map;
      }, {} as Record<string, string>);
    },

    getReservationColor(): (status: string) => string {
      return (status: string): string => {
        const statusColorMap = this.statusColorMap;

        const keyMap: Record<string, string> = {
          'confirmed': 'confirmed_reservation',
          'request': 'confirmed_reservation',
          'complimentary': 'confirmed_reservation',
          'blocked': 'maintenance_block',
          'checkout': 'checked_out',
          'departure': 'due_out',
          'inhouse': 'arrival_stay_over',
          'checked_in': 'arrival_stay_over',
          'occupied': 'arrival_stay_over',
          'dayuse': 'day_use',
        };

        const colorKey = keyMap[status] || status;
        return statusColorMap[colorKey] || '#6B7280';
      }
    }
  },

  actions: {
    setStatusColors(statusColors: StatusColor[]) {
      this.statusColors = statusColors;
    },
    clearStatusColors() {
      this.statusColors = [];
    }
  },
   persist:true,
});
