export const departments = [
  {
    id: 'DEPT001',
    name: 'Front Office',
    description: 'First point of contact for guests, manages check-in, check-out, and inquiries.',
    roles: [
      {
        id: 'ROLE001',
        name: 'Front Office Manager',
        description: 'Oversees all Front Office operations.',
      },
      {
        id: 'ROLE002',
        name: 'Chief Receptionist',
        description: 'Manages the reception team and schedules.',
      },
      {
        id: 'ROLE003',
        name: 'Receptionist',
        description: 'Welcomes guests, performs check-ins/check-outs.',
      },
      {
        id: 'ROLE004',
        name: 'Concierge',
        description: 'Assists guests with personalized services.',
      },
      {
        id: 'ROLE005',
        name: 'Bellboy / Doorman',
        description: 'Assists guests with luggage and hotel access.',
      },
      {
        id: 'ROLE006',
        name: 'Reservation Agent',
        description: 'Manages incoming reservations and requests.',
      },
      {
        id: 'ROLE007',
        name: 'Night Auditor',
        description: 'Manages reception during the night and performs audit.',
      },
      {
        id: 'ROLE008',
        name: 'Guest Relations Officer',
        description: 'Ensures guest satisfaction and manages public relations.',
      },
    ],
  },
  {
    id: 'DEPT002',
    name: 'Housekeeping',
    description: 'Responsible for the cleanliness and comfort of guest rooms and public areas.',
    roles: [
      {
        id: 'ROLE009',
        name: 'Executive Housekeeper',
        description: 'Oversees all housekeeping operations.',
      },
      {
        id: 'ROLE010',
        name: 'Floor Supervisor',
        description: 'Supervises room attendants on a given floor.',
      },
      { id: 'ROLE011', name: 'Room Attendant', description: 'Cleans and prepares guest rooms.' },
      { id: 'ROLE012', name: 'Linen Room Attendant', description: 'Manages hotel linen.' },
      {
        id: 'ROLE013',
        name: 'Public Area Cleaner',
        description: 'Cleans public areas of the hotel.',
      },
    ],
  },
  {
    id: 'DEPT003',
    name: 'Food & Beverage',
    description: 'Manages all food and beverage services in the hotel.',
    roles: [
      {
        id: 'ROLE014',
        name: 'Food & Beverage Manager',
        description: 'Oversees all F&B operations.',
      },
      {
        id: 'ROLE015',
        name: 'Executive Chef',
        description: 'Leads the kitchen and culinary team.',
      },
      {
        id: 'ROLE016',
        name: 'Sous Chef',
        description: 'Assists the Executive Chef and supervises food preparation.',
      },
      {
        id: 'ROLE017',
        name: 'Chef de Partie',
        description: 'Responsible for a specific section of the kitchen.',
      },
      { id: 'ROLE018', name: 'Commis Chef', description: 'Assists chefs in food preparation.' },
      { id: 'ROLE019', name: 'Pastry Chef', description: 'Prepares desserts and baked goods.' },
      {
        id: 'ROLE020',
        name: 'Dishwasher',
        description: 'Ensures cleanliness of dishes and kitchen utensils.',
      },
      {
        id: 'ROLE021',
        name: "Maitre d'Hotel",
        description: 'Welcomes guests to the restaurant and supervises service.',
      },
      {
        id: 'ROLE022',
        name: 'Head Waiter/Waitress',
        description: 'Manages a section of tables in the restaurant.',
      },
      {
        id: 'ROLE023',
        name: 'Waiter / Waitress',
        description: 'Takes orders and serves meals and beverages.',
      },
      { id: 'ROLE024', name: 'Bartender', description: 'Prepares and serves drinks at the bar.' },
      {
        id: 'ROLE025',
        name: 'Sommelier',
        description: 'Advises on wines and manages the wine cellar.',
      },
      {
        id: 'ROLE026',
        name: 'Banquet Manager',
        description: 'Organizes and supervises events and receptions.',
      },
      {
        id: 'ROLE027',
        name: 'Host / Hostess',
        description: 'Welcomes guests at the entrance of restaurants.',
      },
    ],
  },
  {
    id: 'DEPT004',
    name: 'Maintenance',
    description: 'Ensures the proper functioning and maintenance of hotel infrastructure.',
    roles: [
      {
        id: 'ROLE028',
        name: 'Chief Engineer / Technical Director',
        description: 'Leads the maintenance department.',
      },
      { id: 'ROLE029', name: 'Maintenance Technician', description: 'Performs general repairs.' },
      { id: 'ROLE030', name: 'Electrician', description: 'Specialist in electrical systems.' },
      { id: 'ROLE031', name: 'Plumber', description: 'Specialist in plumbing systems.' },
      { id: 'ROLE032', name: 'Carpenter', description: 'Performs carpentry work.' },
      { id: 'ROLE033', name: 'Painter', description: 'Performs painting work.' },
    ],
  },
  {
    id: 'DEPT005',
    name: 'Sales & Marketing',
    description: 'Responsible for promoting the hotel and acquiring customers.',
    roles: [
      {
        id: 'ROLE034',
        name: 'Director of Sales & Marketing',
        description: 'Leads sales and marketing strategies.',
      },
      {
        id: 'ROLE035',
        name: 'Sales Manager',
        description: 'Manages customer relationships and sales contracts.',
      },
      {
        id: 'ROLE036',
        name: 'Marketing Coordinator',
        description: 'Assists in the implementation of marketing campaigns.',
      },
      {
        id: 'ROLE037',
        name: 'Revenue Manager',
        description: 'Optimizes hotel revenue through pricing and inventory management.',
      },
      {
        id: 'ROLE038',
        name: 'E-commerce / Digital Marketing Manager',
        description: 'Manages online presence and digital sales.',
      },
    ],
  },
  {
    id: 'DEPT006',
    name: 'Human Resources',
    description: 'Manages hotel staff, from recruitment to payroll.',
    roles: [
      {
        id: 'ROLE039',
        name: 'Human Resources Director',
        description: 'Develops and implements HR policies.',
      },
      { id: 'ROLE040', name: 'HR Manager', description: 'Manages daily HR operations.' },
      { id: 'ROLE041', name: 'HR Assistant', description: 'Assists with administrative HR tasks.' },
      {
        id: 'ROLE042',
        name: 'Payroll Manager',
        description: 'Manages the employee payroll process.',
      },
    ],
  },
  {
    id: 'DEPT007',
    name: 'Finance & Accounting',
    description: 'Ensures the financial management and accounting compliance of the hotel.',
    roles: [
      {
        id: 'ROLE043',
        name: 'Chief Financial Officer (CFO)',
        description: 'Oversees all financial operations.',
      },
      {
        id: 'ROLE044',
        name: 'Financial Controller',
        description: 'Analyzes financial performance and budgets.',
      },
      {
        id: 'ROLE045',
        name: 'Accountant',
        description: 'Maintains financial records and prepares reports.',
      },
      {
        id: 'ROLE046',
        name: 'Internal Auditor',
        description: 'Verifies compliance with financial procedures.',
      },
      { id: 'ROLE047', name: 'General Cashier', description: 'Manages daily cash flows.' },
    ],
  },
  {
    id: 'DEPT008',
    name: 'Security',
    description: 'Ensures the safety and security of guests, staff, and hotel property.',
    roles: [
      {
        id: 'ROLE048',
        name: 'Chief of Security',
        description: 'Leads the security team and protocols.',
      },
      {
        id: 'ROLE049',
        name: 'Security Guard',
        description: 'Performs surveillance and responds to incidents.',
      },
      {
        id: 'ROLE050',
        name: 'Surveillance Operator',
        description: 'Monitors security systems (cameras, alarms).',
      },
    ],
  },
  {
    id: 'DEPT009',
    name: 'General Management',
    description: 'Responsible for the overall strategy and performance of the hotel.',
    roles: [
      { id: 'ROLE051', name: 'General Manager (GM)', description: 'Leads all hotel operations.' },
      {
        id: 'ROLE052',
        name: 'Assistant General Manager',
        description: 'Assists the General Manager in their duties.',
      },
    ],
  },
  {
    id: 'DEPT010',
    name: 'Activities & Recreation',
    description:
      'Organizes and manages guest activities, entertainment, and recreational facilities.',
    roles: [
      {
        id: 'ROLE053',
        name: 'Activities Manager',
        description: 'Plans and oversees all recreational programs.',
      },
      {
        id: 'ROLE054',
        name: 'Recreation Coordinator',
        description: 'Assists in organizing and leading guest activities.',
      },
      {
        id: 'ROLE055',
        name: 'Sports Instructor',
        description: 'Provides instruction for various sports activities.',
      },
    ],
  },
  {
    id: 'DEPT011',
    name: 'Purchasing & Logistics',
    description: 'Manages the procurement of goods and services, inventory, and supply chain.',
    roles: [
      {
        id: 'ROLE056',
        name: 'Purchasing Manager',
        description: 'Oversees all purchasing activities and supplier relationships.',
      },
      {
        id: 'ROLE057',
        name: 'Procurement Officer',
        description: 'Handles specific purchasing requests and negotiations.',
      },
      {
        id: 'ROLE058',
        name: 'Storekeeper',
        description: 'Manages inventory and stockroom operations.',
      },
      {
        id: 'ROLE059',
        name: 'Receiving Clerk',
        description: 'Receives and verifies incoming deliveries.',
      },
    ],
  },
  {
    id: 'DEPT012',
    name: 'Information Technology (IT)',
    description:
      'Manages and maintains all hotel IT infrastructure, systems, and technical support.',
    roles: [
      {
        id: 'ROLE060',
        name: 'IT Manager',
        description: 'Oversees all IT operations and strategy.',
      },
      {
        id: 'ROLE061',
        name: 'IT Support Technician',
        description: 'Provides technical support to staff and guests.',
      },
      {
        id: 'ROLE062',
        name: 'Network Administrator',
        description: 'Manages and maintains hotel network infrastructure.',
      },
    ],
  },
]
