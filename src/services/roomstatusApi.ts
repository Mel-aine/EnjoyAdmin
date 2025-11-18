// services/roomstatusAPI.ts
import apiClient from './apiClient';
import { useAuthStore } from '@/composables/user'
import type { AxiosResponse } from 'axios'
const API_URL = `${import.meta.env.VITE_API_URL as string}/reports`;
const axios = apiClient;

const getHeaders  = () => {
  const authStore = useAuthStore()
  return {
    headers: {  
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}
export interface RoomStatusWordExportParams {
  date: string;
  hotelId: number;
}

export interface RoomDetails {
  roomId: number;
  roomNumber: string;
  floor: number | null;
  etatMatin: string;
  etatSoir: string;
  observations: string;
  assignedHousekeeper: string;
  currentStatus: string;
  lastCleaned: string | null;
  maintenanceRequired: boolean;
}

export interface RoomTypeData {
  roomTypeId: number;
  roomTypeName: string;
  shortCode: string;
  totalRooms: number;
  rooms: RoomDetails[];
}

export interface Statistics {
  totalRoomTypes: number;
  totalRooms: number;
  totalWithObservations: number;
  statusBreakdown: {
    OP: number;
    OS: number;
    LP: number;
    LS: number;
    AR: number;
    DP: number;
    DT: number;
    DL: number;
    RS: number;
    HS: number;
    RM: number;
    DG: number;
  };
  legend: {
    OP: string;
    OS: string;
    LP: string;
    LS: string;
    AR: string;
    DP: string;
    DT: string;
    DL: string;
    RS: string;
    HS: string;
    RM: string;
    DG: string;
  };
}

export interface RoomStatusReportData {
  hotelDetails: {
    hotelId: number;
    hotelName: string;
    address: string;
    email: string;
  };
  reportDate: string;
  dateFormatted: string;
  roomsByType: RoomTypeData[];
  statistics: Statistics;
}

export interface RoomStatusReportResponse {
  success: boolean;
  message: string;
  data: RoomStatusReportData;
  filters: {
    date: string;
    hotelId: number;
  };
  generatedAt: string;
  generatedBy: string;
}



/**
 * Récupère le rapport d'état des chambres au format JSON
 */
export const fetchRoomStatusReport = async (
  params: RoomStatusWordExportParams
): Promise<RoomStatusReportResponse> => {
  const { date, hotelId } = params;

  // Validation des paramètres
  if (!date) {
    throw new Error('La date est requise pour le rapport');
  }

  if (!hotelId) {
    throw new Error('L\'ID de l\'hôtel est requis pour le rapport');
  }

  try {
    const response = await axios.post<RoomStatusReportResponse>(
      `${API_URL}/front-office/rooms-status`,
      { date, hotelId },
      getHeaders()
    );

    if (!response.data) {
      throw new Error('Aucune donnée reçue du serveur');
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la génération du rapport');
    }

    console.log('✅ Rapport d\'état des chambres récupéré avec succès');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du rapport d\'état des chambres:', error);

    // Gestion des erreurs HTTP
    const resp = (error as any)?.response;
    if (resp) {
      if (resp.status === 404) {
        throw new Error('Le rapport demandé n\'a pas été trouvé');
      }
      if (resp.status === 400) {
        const errorData = resp.data;
        throw new Error(errorData?.message || 'Paramètres de requête invalides');
      }
      if (resp.data) {
        try {
          const errorData = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;
          throw new Error(errorData?.message || errorData?.error || 'Échec de la récupération du rapport');
        } catch {
          throw new Error('Échec de la récupération du rapport');
        }
      }
      throw new Error((error as any)?.message || 'Échec de la récupération du rapport');
    }

    // Propagation des erreurs existantes
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Une erreur inattendue est survenue lors de la récupération du rapport');
  }
};

export const getRoomStatusPDF = async (data: { hotelId: number, date: string }): Promise<Blob> => {
  try {
    const url = `${API_URL}/front-office/rooms-status-pdf`
    
    const response: AxiosResponse<Blob> = await axios.post(url, data, {
      ...getHeaders(),
      responseType: 'blob',
    })
    
    // Le backend retourne directement un PDF, pas besoin de validation supplémentaire
    return response.data
  } catch (error) {
    console.error('Error fetching room status PDF:', error)
    throw error
  }
}

export const getRoomStatusPdfUrl = async (data: { hotelId: number, date: string }): Promise<string> => {
  try {
    const pdfBlob = await getRoomStatusPDF(data)
    return URL.createObjectURL(pdfBlob)
  } catch (error) {
    console.error('Error creating PDF URL:', error)
    throw error
  }
}
/**
 * Transforme les données du rapport en format compatible avec le composant RapportExportTable
 */
export const transformReportDataForTable = (reportData: RoomStatusReportData): {
  tableData: any[];
  legendData: any[];
} => {
  // Transformer les données pour le tableau
  const tableData = reportData.roomsByType.flatMap(roomType => 
    roomType.rooms.map(room => ({
      ls: room.roomNumber,
      etatMatin: room.etatMatin,
      etatSoir: room.etatSoir,
      observations: room.observations,
      hsh: room.assignedHousekeeper,
      etatMatinHsh: room.etatMatin, // Vous pouvez adapter selon vos besoins
      etatSoirHsh: room.etatSoir,   // Vous pouvez adapter selon vos besoins
      observationsHsh: room.observations // Vous pouvez adapter selon vos besoins
    }))
  );

  // Transformer la légende
  const legendData = Object.entries(reportData.statistics.legend).map(([key, value]) => ({
    label: key,
    value: value
  }));

  // Ajouter les statistiques globales à la légende
  legendData.push(
    { label: 'Total Chambres', value: reportData.statistics.totalRooms.toString() },
    { label: 'Total Types', value: reportData.statistics.totalRoomTypes.toString() },
    { label: 'Avec Observations', value: reportData.statistics.totalWithObservations.toString() }
  );

  return {
    tableData,
    legendData
  };
};