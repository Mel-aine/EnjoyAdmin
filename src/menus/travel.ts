// import {
//   LayoutDashboard,
//   Plane,
//   Building2,
//   Hotel,
//   CalendarDays,
//   ClipboardCheck,
//   UsersRound,
//   Banknote,
//   MapPin,
//   UserCircleIcon,
//   SettingsIcon,
//   LineChart,
//   Bus,
//   Sailboat
// } from 'lucide-vue-next';

// export const getTravelAgencyMenu = (t: (key: string) => string) => {
//   return [
//     {
//       title: 'Menu',
//       items: [
//         {
//           icon: LayoutDashboard,
//           name: t('Dashboard'),
//           path: '/',
//           roles: [1, 2, 3],
//         },
//         {
//           icon: Plane,
//           name: t('Réservations'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Toutes les réservations'), path: '/all_reservations', roles: [1, 2, 3] },
//             { name: t('Nouvelle réservation'), path: '/add_reservation', roles: [1, 2, 3] },
//             { name: t('Réservations en attente'), path: '/pending_reservations', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: MapPin,
//           name: t('Destinations'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Toutes les destinations'), path: '/all_destinations', roles: [1, 2, 3] },
//             { name: t('Ajouter destination'), path: '/add_destination', roles: [1, 2] },
//             { name: t('Catégories'), path: '/destination_categories', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: Hotel,
//           name: t('Hébergements'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Liste des hébergements'), path: '/accommodations', roles: [1, 2, 3] },
//             { name: t('Types d\'hébergement'), path: '/accommodation_types', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: CalendarDays,
//           name: t('Calendrier'),
//           path: '/calendar',
//           roles: [1, 2, 3],
//         },
//         {
//           icon: Building2,
//           name: t('Partenaires'),
//           roles: [1, 2],
//           subItems: [
//             { name: t('Compagnies aériennes'), path: '/airlines', roles: [1, 2] },
//             { name: t('Hôtels'), path: '/hotel_partners', roles: [1, 2] },
//             { name: t('Transporteurs'), path: '/transport_providers', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: ClipboardCheck,
//           name: t('Produits'),
//           roles: [1, 2],
//           subItems: [
//             { name: t('Voyages organisés'), path: '/package_tours', roles: [1, 2] },
//             { name: t('Vols'), path: '/flights', roles: [1, 2] },
//             { name: t('Circuits'), path: '/tours', roles: [1, 2] },
//             { name: t('Transferts'), path: '/transfers', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: Bus,
//           name: t('Transport'),
//           path: '/transport',
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Réservation voiture'), path: '/car_rental', roles: [1, 2, 3] },
//             { name: t('Transferts aéroport'), path: '/airport_transfers', roles: [1, 2, 3] },
//             { name: t('Excursions'), path: '/excursions', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: Sailboat,
//           name: t('Activités'),
//           path: '/activities',
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Liste des activités'), path: '/all_activities', roles: [1, 2, 3] },
//             { name: t('Ajouter activité'), path: '/add_activity', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: UsersRound,
//           name: t('Clients'),
//           path: '/customers',
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Liste des clients'), path: '/all_customers', roles: [1, 2, 3] },
//             { name: t('Ajouter client'), path: '/add_customer', roles: [1, 2, 3] },
//             { name: t('Groupes'), path: '/customer_groups', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: Banknote,
//           name: t('Paiements'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Liste des factures'), path: '/all_invoices', roles: [1, 2, 3] },
//             { name: t('Détails facture'), path: '/invoice', roles: [1, 2, 3] },
//             { name: t('Acomptes'), path: '/deposits', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: LineChart,
//           name: t('Rapports'),
//           roles: [1, 2],
//           subItems: [
//             { name: t('Ventes'), path: '/sales_report', roles: [1, 2] },
//             { name: t('Performance'), path: '/performance', roles: [1, 2] },
//             { name: t('Destinations populaires'), path: '/popular_destinations', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: UserCircleIcon,
//           name: t('Utilisateurs'),
//           path: '/users',
//           roles: [1, 2],
//         },
//         {
//           icon: SettingsIcon,
//           name: t('Paramètres'),
//           path: '/settings',
//           roles: [1, 2],
//         },
//       ],
//     },
//   ];
// };
// import {
//   LayoutDashboard,
//   Bus,
//   Building2,
//   TicketCheck,
//   CalendarDays,
//   ClipboardCheck,
//   UsersRound,
//   Banknote,
//   MapPin,
//   UserCircleIcon,
//   SettingsIcon,
//   LineChart,
//   Route,
//   Car
// } from 'lucide-vue-next';

// export const getBusAgencyMenu = (t: (key: string) => string) => {
//   return [
//     {
//       title: 'Menu',
//       items: [
//         {
//           icon: LayoutDashboard,
//           name: t('Dashboard'),
//           path: '/',
//           roles: [1, 2, 3],
//         },
//         {
//           icon: Bus,
//           name: t('Réservations'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Toutes les réservations'), path: '/all_reservations', roles: [1, 2, 3] },
//             { name: t('Nouvelle réservation'), path: '/add_reservation', roles: [1, 2, 3] },
//             { name: t('Réservations de groupe'), path: '/group_reservations', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: Route,
//           name: t('Itinéraires'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Tous les itinéraires'), path: '/all_routes', roles: [1, 2, 3] },
//             { name: t('Arrêts'), path: '/bus_stops', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: Route,
//           name: t('gestion de voyage'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Tous les itinéraires'), path: '/all_routes', roles: [1, 2, 3] },
//             { name: t('Arrêts'), path: '/bus_stops', roles: [1, 2] },
//           ],
//         },
//         // {
//         //   icon: TicketCheck,
//         //   name: t('Billets'),
//         //   roles: [1, 2, 3],
//         //   subItems: [
//         //     { name: t('Émission de billets'), path: '/ticket_issuance', roles: [1, 2, 3] },
//         //     { name: t('Types de billets'), path: '/ticket_types', roles: [1, 2] },
//         //     { name: t('Vérification'), path: '/ticket_validation', roles: [1, 2, 3] },
//         //   ],
//         // },
//         {
//           icon: ,
//           name: t('gestion des equipement'),
//           path: '/',
//           roles: [1, 2, 3],
//         },
//         {
//           icon: CalendarDays,
//           name: t('Calendrier'),
//           path: '/calendar',
//           roles: [1, 2, 3],
//         },
//         // {
//         //   icon: Building2,
//         //   name: t('Compagnie'),
//         //   roles: [1, 2],
//         //   subItems: [
//         //     { name: t('Flotte de bus'), path: '/bus_fleet', roles: [1, 2] },
//         //     { name: t('Conducteurs'), path: '/drivers', roles: [1, 2] },
//         //     { name: t('Maintenance'), path: '/maintenance', roles: [1, 2] },
//         //   ],
//         // },
//         // {
//         //   icon: ClipboardCheck,
//         //   name: t('Services'),
//         //   roles: [1, 2],
//         //   subItems: [
//         //     { name: t('Lignes régulières'), path: '/regular_lines', roles: [1, 2] },
//         //     { name: t('Services charter'), path: '/charter_services', roles: [1, 2] },
//         //     { name: t('Excursions'), path: '/excursions', roles: [1, 2] },
//         //     { name: t('Navettes'), path: '/shuttles', roles: [1, 2] },
//         //   ],
//         // },
//         // {
//         //   icon: Car,
//         //   name: t('Transport'),
//         //   path: '/transport',
//         //   roles: [1, 2, 3],
//         //   subItems: [
//         //     { name: t('Correspondances'), path: '/connections', roles: [1, 2, 3] },
//         //     { name: t('Transferts'), path: '/transfers', roles: [1, 2, 3] },
//         //     { name: t('Transport spécial'), path: '/special_transport', roles: [1, 2, 3] },
//         //   ],
//         // },
//         {
//           icon: UsersRound,
//           name: t('Clients'),
//           path: '/customers',
//           roles: [1, 2, 3],
//           // subItems: [
//           //   { name: t('Liste des clients'), path: '/all_customers', roles: [1, 2, 3] },
//           //   { name: t('Ajouter client'), path: '/add_customer', roles: [1, 2, 3] },
//           //   { name: t('Groupes'), path: '/customer_groups', roles: [1, 2, 3] },
//           // ],
//         },
//         {
//           icon: Banknote,
//           name: t('Paiements'),
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Liste des factures'), path: '/all_invoices', roles: [1, 2, 3] },
//             { name: t('Détails facture'), path: '/invoice', roles: [1, 2, 3] },
//             { name: t('Acomptes'), path: '/deposits', roles: [1, 2, 3] },
//           ],
//         },
//         {
//           icon: LineChart,
//           name: t('Rapports'),
//           roles: [1, 2],
//           subItems: [
//             { name: t('Statistiques d\'utilisation'), path: '/usage_statistics', roles: [1, 2] },
//             { name: t('Performance des lignes'), path: '/line_performance', roles: [1, 2] },
//             { name: t('Taux d\'occupation'), path: '/occupancy_rates', roles: [1, 2] },
//             { name: t('Rapports de consommation'), path: '/consumption_reports', roles: [1, 2] },
//           ],
//         },
//         {
//           icon: UserCircleIcon,
//           name: t('Utilisateurs'),
//           path: '/users',
//           roles: [1, 2],
//         },
//         {
//           icon: SettingsIcon,
//           name: t('Paramètres'),
//           path: '/settings',
//           roles: [1, 2],
//         },
//         {
//           icon: MapPin,
//           name: t('Planification'),
//           path: '/planning',
//           roles: [1, 2, 3],
//           subItems: [
//             { name: t('Horaires'), path: '/schedules', roles: [1, 2, 3] },
//             { name: t('Gestion des trajets'), path: '/route_management', roles: [1, 2] },
//             { name: t('Affectation des véhicules'), path: '/vehicle_assignment', roles: [1, 2] },
//           ],
//         }
//       ],
//     },
//   ];
// };
import {
  LayoutDashboard,
  Bus,
  Building2,
  TicketCheck,
  CalendarDays,
  ClipboardCheck,
  UsersRound,
  Banknote,
  MapPin,
  UserCircleIcon,
  SettingsIcon,
  LineChart,
  Route,
  Car,
  Wrench,
  UserCog,
  Luggage,
  MapPinned
} from 'lucide-vue-next';

export const getBusAgencyMenu = (t: (key: string) => string) => {
  return [
    {
      title: 'Menu',
      items: [
        {
          icon: LayoutDashboard,
          name: t('Tableau de bord'),
          path: '/',
          roles: [1, 2, 3],
        },
        {
          icon: Bus,
          name: t('Réservations'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Toutes les réservations'), path: '/all_reservations', roles: [1, 2, 3] },
            { name: t('Nouvelle réservation'), path: '/add_reservation', roles: [1, 2, 3] },
          ],
        },
        {
          icon: Route,
          name: t('Itinéraires'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Tous les itinéraires'), path: '/all_routes', roles: [1, 2, 3] },
            { name: t('Arrêts'), path: '/bus_stops', roles: [1, 2] },
          ],
        },
        {
          icon: Car,
          name: t('Gestion de voyage'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Liste de voyages'), path: '/scheduled_trips', roles: [1, 2, 3] },
            // { name: t('Services charter'), path: '/charter_services', roles: [1, 2] },
            // { name: t('Excursions'), path: '/excursions', roles: [1, 2] },
            // { name: t('Navettes'), path: '/shuttles', roles: [1, 2, 3] },
          ],
        },
        // {
        //   icon: TicketCheck,
        //   name: t('Billets'),
        //   roles: [1, 2, 3],
        //   subItems: [
        //     { name: t('Émission de billets'), path: '/ticket_issuance', roles: [1, 2, 3] },
        //     { name: t('Types de billets'), path: '/ticket_types', roles: [1, 2] },
        //     { name: t('Vérification'), path: '/ticket_validation', roles: [1, 2, 3] },
        //   ],
        // },
        {
          icon: Wrench,
          name: t('Gestion des équipements'),
          roles: [1, 2],
          subItems: [
            { name: t('véhicules'), path: '/vehicle_fleet', roles: [1, 2] },
            // { name: t('Maintenance'), path: '/maintenance_schedule', roles: [1, 2] },
            // { name: t('Inventaire'), path: '/equipment_inventory', roles: [1, 2] },
          ],
        },
        {
          icon: CalendarDays,
          name: t('Calendrier'),
          path: '/calendar',
          roles: [1, 2, 3],
        },
        // {
        //   icon: Building2,
        //   name: t('Compagnie'),
        //   roles: [1, 2],
        //   subItems: [
        //     { name: t('Conducteurs'), path: '/drivers', roles: [1, 2] },
        //     { name: t('Personnel'), path: '/staff', roles: [1, 2] },
        //     // { name: t('Informations'), path: '/company_info', roles: [1, 2] },
        //   ],
        // },
        {
          icon: UserCircleIcon,
          name: t('User'),
          path: '/users',
          roles: [1, 2],
        },
        {
          icon: UsersRound,
          name: t('Clients'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Liste des clients'), path: '/all_customers', roles: [1, 2, 3] },
            // { name: t('Ajouter client'), path: '/add_customer', roles: [1, 2, 3] },
            // { name: t('Groupes'), path: '/customer_groups', roles: [1, 2, 3] },
          ],
        },
        // {
        //   icon: Banknote,
        //   name: t('Paiements'),
        //   roles: [1, 2, 3],
        //   subItems: [
        //     { name: t('Liste des factures'), path: '/all_invoices', roles: [1, 2, 3] },
        //     { name: t('Détails facture'), path: '/invoice', roles: [1, 2, 3] },
        //     { name: t('Acomptes'), path: '/deposits', roles: [1, 2, 3] },
        //   ],
        // },
        {
          icon: MapPinned,
          name: t('Planification'),
          roles: [1, 2, 3],
          subItems: [
            { name: t('Horaires'), path: '/schedules', roles: [1, 2, 3] },
            { name: t('Gestion des trajets'), path: '/route_management', roles: [1, 2] },
            { name: t('Affectation des véhicules'), path: '/vehicle_assignment', roles: [1, 2] },
          ],
        },
        // {
        //   icon: Luggage,
        //   name: t('Services additionnels'),
        //   roles: [1, 2, 3],
        //   subItems: [
        //     { name: t('Correspondances'), path: '/connections', roles: [1, 2, 3] },
        //     { name: t('Transferts'), path: '/transfers', roles: [1, 2, 3] },
        //     { name: t('Transport spécial'), path: '/special_transport', roles: [1, 2, 3] },
        //   ],
        // },
        // {
        //   icon: LineChart,
        //   name: t('Rapports et statistiques'),
        //   roles: [1, 2],
        //   subItems: [
        //     { name: t('Statistiques d\'utilisation'), path: '/usage_statistics', roles: [1, 2] },
        //     { name: t('Performance des lignes'), path: '/line_performance', roles: [1, 2] },
        //     { name: t('Taux d\'occupation'), path: '/occupancy_rates', roles: [1, 2] },
        //     { name: t('Rapports de consommation'), path: '/consumption_reports', roles: [1, 2] },
        //     { name: t('Revenus'), path: '/revenue_reports', roles: [1, 2] },
        //   ],
        // },
        {
          icon: UserCog,
          name: t('Utilisateurs'),
          path: '/users',
          roles: [1],
        },
        {
          icon: SettingsIcon,
          name: t('Paramètres'),
          path: '/settings',
          roles: [1, 2],
        },
      ],
    },
  ];
};
