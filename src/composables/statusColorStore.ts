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
    }
  },

  actions: {
    setStatusColors(statusColors: StatusColor[]) {
      this.statusColors = statusColors;
    },

    // Helper method to get color with fallback
    getReservationColor(status: string): string {
      const colorMap: Record<string, string> = {
        // Map reservation statuses to status color keys
        'confirmed': this.getColorByKey('confirmed_reservation'),
        'request': this.getColorByKey('confirmed_reservation'), // or create a separate key
        'complimentary': this.getColorByKey('confirmed_reservation'),
        'blocked': this.getColorByKey('maintenance_block'),
        'checkout': this.getColorByKey('checked_out'),
        'departure': this.getColorByKey('due_out'),
        'inhouse': this.getColorByKey('arrival_stay_over'),
        'checked_in': this.getColorByKey('arrival_stay_over'),
        'occupied': this.getColorByKey('arrival_stay_over'),
      };

      return colorMap[status] || this.getColorByKey(status) || '#6B7280';
    }
  },
});
