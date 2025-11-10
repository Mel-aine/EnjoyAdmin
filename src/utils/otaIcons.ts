// Shared OTA icon helper used across reservation views/components
// Maps an OTA name (e.g., "Booking.com") to a public SVG asset under `/images/ota/`

const OTA_MAP: Record<string, string> = {
  agoda: 'agoda',
  airbnb: 'airbnb',
  booking: 'booking',
  expedia: 'expedia',
  tripcom: 'tripcom',
  ctrip: 'ctrip',
  priceline: 'priceline',
  travelocity: 'travelocity',
  orbitz: 'orbitz',
  kayak: 'kayak',
  vrbo: 'vrbo',
  hotels: 'hotels',
  lastminute: 'lastminute',
  makemytrip: 'makemytrip',
  traveloka: 'traveloka',
  ebookers: 'ebookers',
  wotif: 'wotif',
  hotwire: 'hotwire',
  hrs: 'hrs',
  hostelworld: 'hostelworld',
  hotelbeds: 'hotelbeds',
}

const normalizeOtaName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\.-]/g, '')
}

export const getOtaIconSrc = (name?: string | null): string | null => {
  if (!name) return null
  const norm = normalizeOtaName(name)

  // Handle common variants explicitly
  const aliases: Record<string, string> = {
    'bookingcom': 'booking',
    'tripcom': 'tripcom',
    'ctrip': 'ctrip',
    'hotelscom': 'hotels',
  }

  const alias = aliases[norm]
  const key = alias || OTA_MAP[norm]
  return key ? `/images/ota/${key}.svg` : null
}

export default getOtaIconSrc