import { createWorker } from 'tesseract.js'

export interface ExtractedIdData {
  idType: 'Passport' | 'ID Card' | 'Visa' | 'Unknown'
  idNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  issuingCountry?: string
  idExpiryDate?: string
  placeOfBirth?: string
  sex?: string
  issuingCity?: string
}

// Worker Tesseract persistant pour accélérer les reconnaissances successives
let ocrWorker: any | null = null
let currentLanguage: string | undefined
let currentProgressCb: ((p: number) => void) | undefined

async function getOcrWorker(): Promise<any> {
  if (ocrWorker) return ocrWorker
  // Initialiser directement avec la langue par défaut et le logger (API v6)
  ocrWorker = await createWorker(
    'eng+fra',
    undefined,
    {
      logger: (m: any) => {
        if (m?.status === 'recognizing text' && typeof currentProgressCb === 'function') {
          const p = Math.round((m.progress || 0) * 100)
          currentProgressCb(p)
        }
      },
    },
  )
  currentLanguage = 'eng+fra'
  return ocrWorker
}

async function ensureLanguage(lang = 'eng+fra'): Promise<void> {
  const worker = await getOcrWorker()
  if (currentLanguage !== lang) {
    await worker.reinitialize(lang)
    await worker.setParameters({
      tessedit_pageseg_mode: '6',
      preserve_interword_spaces: '1',
    })
    currentLanguage = lang
  }
}

async function recognizeText(
  image: HTMLCanvasElement | HTMLImageElement | string | File,
  params?: Record<string, string>,
  onProgress?: (progress: number) => void,
  options?: { rotateAuto?: boolean }
): Promise<string> {
  await ensureLanguage('eng+fra')
  const worker = await getOcrWorker()
  currentProgressCb = onProgress
  if (params) {
    await worker.setParameters(params)
  }
  const { data } = await worker.recognize(image, options)
  return data.text as string
}

function rotateCanvas(src: HTMLCanvasElement, angleDeg: number): HTMLCanvasElement {
  const rad = (angleDeg * Math.PI) / 180
  const dst = document.createElement('canvas')
  const dctx = dst.getContext('2d')!
  if (angleDeg % 180 !== 0) {
    dst.width = src.height
    dst.height = src.width
  } else {
    dst.width = src.width
    dst.height = src.height
  }
  dctx.translate(dst.width / 2, dst.height / 2)
  dctx.rotate(rad)
  dctx.drawImage(src, -src.width / 2, -src.height / 2)
  return dst
}

function resizeToMax(src: HTMLCanvasElement, maxDim = 1600): HTMLCanvasElement {
  const { width, height } = src
  const scale = Math.min(1, maxDim / Math.max(width, height))
  if (scale === 1) return src
  const dst = document.createElement('canvas')
  dst.width = Math.round(width * scale)
  dst.height = Math.round(height * scale)
  const ctx = dst.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, 0, 0, dst.width, dst.height)
  return dst
}

function cropBottom(src: HTMLCanvasElement, ratio = 0.35): HTMLCanvasElement {
  const h = Math.round(src.height * ratio)
  const y = src.height - h
  const dst = document.createElement('canvas')
  dst.width = src.width
  dst.height = h
  const ctx = dst.getContext('2d')!
  ctx.drawImage(src, 0, y, src.width, h, 0, 0, src.width, h)
  return dst
}

// Liste exhaustive des pays pour détection
const COUNTRY_PATTERNS: Array<[RegExp, string, string]> = [
  // [Pattern de détection, Nom complet, Code ISO 2 lettres]
  [/\b(CAMEROUN|CAMEROON|CAMEROUNAISE|CAMEROONIAN|CMR)\b/i, 'Cameroon', 'CM'],
  [/\b(FRANCE|FRANCAISE|FRENCH|FRA)\b/i, 'France', 'FR'],
  [/\b(MAROC|MOROCCO|MAROCAIN|MOROCCAN|MAR)\b/i, 'Morocco', 'MA'],
  [/\b(ALGERIE|ALGERIA|ALGERIEN|ALGERIAN|DZA)\b/i, 'Algeria', 'DZ'],
  [/\b(TUNISIE|TUNISIA|TUNISIEN|TUNISIAN|TUN)\b/i, 'Tunisia', 'TN'],
  [/\b(NIGERIA|NIGERIAN|NGA)\b/i, 'Nigeria', 'NG'],
  [/\b(GHANA|GHANAIAN|GHA)\b/i, 'Ghana', 'GH'],
  [/\b(SENEGAL|SENEGALAIS|SENEGALESE|SEN)\b/i, 'Senegal', 'SN'],
  [/\b(COTE\s*D'?IVOIRE|IVORY\s*COAST|IVOIRIEN|CIV)\b/i, 'Côte d\'Ivoire', 'CI'],
  [/\b(KENYA|KENYAN|KEN)\b/i, 'Kenya', 'KE'],
  [/\b(ETHIOPIA|ETHIOPIAN|ETH)\b/i, 'Ethiopia', 'ET'],
  [/\b(SOUTH\s*AFRICA|AFRIQUE\s*DU\s*SUD|ZAF)\b/i, 'South Africa', 'ZA'],
  [/\b(EGYPT|EGYPTE|EGYPTIAN|EGY)\b/i, 'Egypt', 'EG'],
  [/\b(GABON|GABONAIS|GABONESE|GAB)\b/i, 'Gabon', 'GA'],
  [/\b(CONGO|CONGOLAIS|CONGOLESE|COG|COD)\b/i, 'Congo', 'CG'],
  [/\b(TCHAD|CHAD|CHADIAN|TCD)\b/i, 'Chad', 'TD'],
  [/\b(NIGER|NIGERIEN|NER)\b/i, 'Niger', 'NE'],
  [/\b(MALI|MALIEN|MALIAN|MLI)\b/i, 'Mali', 'ML'],
  [/\b(BURKINA\s*FASO|BURKINABE|BFA)\b/i, 'Burkina Faso', 'BF'],
  [/\b(BENIN|BENINOIS|BENINESE|BEN)\b/i, 'Benin', 'BJ'],
  [/\b(TOGO|TOGOLAIS|TOGOLESE|TGO)\b/i, 'Togo', 'TG'],
  [/\b(SWITZERLAND|SUISSE|SWISS|CHE)\b/i, 'Switzerland', 'CH'],
  [/\b(BELGIUM|BELGIQUE|BELGIAN|BEL)\b/i, 'Belgium', 'BE'],
  [/\b(NETHERLANDS|PAYS[- ]BAS|DUTCH|NLD)\b/i, 'Netherlands', 'NL'],
  [/\b(ITALY|ITALIE|ITALIAN|ITA)\b/i, 'Italy', 'IT'],
  [/\b(SPAIN|ESPAGNE|SPANISH|ESP)\b/i, 'Spain', 'ES'],
  [/\b(GERMANY|ALLEMAGNE|GERMAN|DEU)\b/i, 'Germany', 'DE'],
  [/\b(PORTUGAL|PORTUGAIS|PORTUGUESE|PRT)\b/i, 'Portugal', 'PT'],
  [/\b(UNITED\s*KINGDOM|ROYAUME[- ]UNI|UK|BRITISH|GBR)\b/i, 'United Kingdom', 'GB'],
  [/\b(UNITED\s*STATES|ETATS[- ]UNIS|USA|AMERICAN)\b/i, 'United States', 'US'],
  [/\b(CANADA|CANADIAN|CAN)\b/i, 'Canada', 'CA'],
  [/\b(CHINA|CHINE|CHINESE|CHN)\b/i, 'China', 'CN'],
  [/\b(INDIA|INDE|INDIAN|IND)\b/i, 'India', 'IN'],
  [/\b(JAPAN|JAPON|JAPANESE|JPN)\b/i, 'Japan', 'JP'],
  [/\b(TURKEY|TURQUIE|TURKISH|TUR)\b/i, 'Turkey', 'TR'],
  [/\b(RUSSIA|RUSSIE|RUSSIAN|RUS)\b/i, 'Russia', 'RU'],
  [/\b(BRAZIL|BRESIL|BRAZILIAN|BRA)\b/i, 'Brazil', 'BR'],
  [/\b(MEXICO|MEXIQUE|MEXICAN|MEX)\b/i, 'Mexico', 'MX'],
  [/\b(AUSTRALIA|AUSTRALIE|AUSTRALIAN|AUS)\b/i, 'Australia', 'AU'],
]

// Villes principales par pays pour améliorer la détection
const CITY_PATTERNS: Array<[RegExp, string]> = [
  // Cameroun
  [/\b(YAOUNDE|YAOUNDÉ)\b/i, 'Yaoundé'],
  [/\b(DOUALA)\b/i, 'Douala'],
  [/\b(GAROUA)\b/i, 'Garoua'],
  [/\b(BAMENDA)\b/i, 'Bamenda'],
  [/\b(BAFOUSSAM)\b/i, 'Bafoussam'],
  [/\b(MAROUA)\b/i, 'Maroua'],
  [/\b(NGAOUNDERE|NGAOUNDÉRÉ)\b/i, 'Ngaoundéré'],
  
  // France
  [/\b(PARIS)\b/i, 'Paris'],
  [/\b(MARSEILLE)\b/i, 'Marseille'],
  [/\b(LYON)\b/i, 'Lyon'],
  [/\b(TOULOUSE)\b/i, 'Toulouse'],
  [/\b(NICE)\b/i, 'Nice'],
  [/\b(NANTES)\b/i, 'Nantes'],
  [/\b(BORDEAUX)\b/i, 'Bordeaux'],
  [/\b(OTTAWA)\b/i, 'Ottawa'],
  
  // Maroc
  [/\b(RABAT)\b/i, 'Rabat'],
  [/\b(CASABLANCA)\b/i, 'Casablanca'],
  [/\b(FES|FÈS)\b/i, 'Fès'],
  [/\b(MARRAKECH)\b/i, 'Marrakech'],
  [/\b(TANGER|TANGIER)\b/i, 'Tanger'],
  
  // Autres villes importantes
  [/\b(ABIDJAN)\b/i, 'Abidjan'],
  [/\b(DAKAR)\b/i, 'Dakar'],
  [/\b(ACCRA)\b/i, 'Accra'],
  [/\b(LAGOS)\b/i, 'Lagos'],
  [/\b(NAIROBI)\b/i, 'Nairobi'],
  [/\b(KINSHASA)\b/i, 'Kinshasa'],
  [/\b(BRAZZAVILLE)\b/i, 'Brazzaville'],
  [/\b(LIBREVILLE)\b/i, 'Libreville'],
]

// Patterns pour numéros d'identité (ordre de priorité)
const ID_NUMBER_PATTERNS = [
  // CNI - FR/EN
  /(?:NUMEROCNI|NUMERO\s*CNI|NIC\s*NUMBER|N°\s*CNI|NO\s*CNI)[:\s]*([A-Z0-9]{6,20})/i,
  /(?:CARTE\s+D'?IDENTIT[EÉ]|IDENTITY\s*CARD)\s*(?:NO|N°|NUMBER)?\s*[:\-]?\s*([A-Z0-9]{6,20})/i,
  
  // Passport - multi-langues
  /(?:PASSPORT\s*NO\.?|NO\.?\s*PASSPORT|N°\s*(?:DE\s*)?PASSEPORT|PASSEPORT\s*N°|PASSPORT\s*NUMBER)[:\s]*([A-Z0-9]{6,15})/i,
  /(?:PASAPORTE|PASSAPORTO|REISEPASS(?:NR|NUMMER)?|NUM(?:ERO)?\s*(?:DE|DO)\s*PASS(?:APORTE|APORTO)|Nº\s*PASSAPORTE)[:\s]*([A-Z0-9]{6,15})/i,
  
  // Espagnol / Portugais / Italien / Allemand pour CNI
  /(?:DNI|N[ÚU]MERO\s+DE\s+IDENTIDAD|N[ÚU]MERO\s+DE\s+DOCUMENTO|C[EÉ]DULA)\s*(?:N[ºO\.]|NO|N°|NUM(?:ERO)?)?\s*[:\-]?\s*([A-Z0-9]{6,20})/i,
  /(?:BILHETE\s+DE\s+IDENTIDADE|CART(?:A|Ã)O\s+DE\s+CIDAD(?:Ã|A)O|N[ÚU]MERO\s+DO\s+DOCUMENTO)\s*(?:N[ºO\.]|NO|N°|NUM(?:ERO)?)?\s*[:\-]?\s*([A-Z0-9]{6,20})/i,
  /(?:PERSONALAUSWEIS|AUSWEIS)\s*(?:NR|NUMMER)?\s*[:\-]?\s*([A-Z0-9]{6,20})/i,
  /(?:CARTA\s+D'?IDENTIT[ÀA]|NUMERO\s+DOCUMENTO)\s*[:\-]?\s*([A-Z0-9]{6,20})/i,

  // Variations génériques
  /(?:NUMEROCNI|NIC\s*NUMBER)[\s:]*([A-Z0-9\s-]{6,20})/i,
  /(?:PASSPORT|PASSEPORT)[\s:]*(?:NO|N°|NUMBER)[\s:.]*([A-Z0-9\s-]{6,15})/i,
  /(?:ID|CNI|CARTE|CARD|DOC(?:UMENT)?)\s*(?:NO\.?|N°|NR\.?|NUM(?:BER|ERO)?)\s*[:\-]?\s*([A-Z0-9]{6,20})/i,
]

// Patterns pour dates d'expiration
const EXPIRY_DATE_PATTERNS = [
  // FR/EN
  /(?:EXPIR(?:Y|ATION)|VALID(?:ITY|ITÉ)|JUSQU'AU)\s*(?:DATE)?[:\s]*(\d{1,2}[-\.\/\s]\d{1,2}[-\.\/\s]\d{2,4})/i,
  /(?:EXPIR(?:Y|ATION)|VALID(?:ITY|ITÉ))[:\s]*(\d{1,2}\s+(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{4})/i,
  
  // ES/PT/DE/IT libellés
  /(?:FECHA\s+DE\s+EXPIRACI[ÓO]N|VENCE|VALIDEZ\s+HASTA)\s*[:\s]*(\d{1,2}[-\.\/\s]\d{1,2}[-\.\/\s]\d{2,4})/i,
  /(?:DATA\s+DE\s+EXPIRA[ÇC][ÃA]O|VALIDADE|V[ÁA]LIDO\s+AT[EÉ])\s*[:\s]*(\d{1,2}[-\.\/\s]\d{1,2}[-\.\/\s]\d{2,4})/i,
  /(?:G[ÜU]LTIG\s+BIS|ABLAUFDATUM)\s*[:\s]*(\d{1,2}[-\.\/\s]\d{1,2}[-\.\/\s]\d{2,4})/i,
  /(?:DATA\s+DI\s+SCADENZA|SCADENZA)\s*[:\s]*(\d{1,2}[-\.\/\s]\d{1,2}[-\.\/\s]\d{2,4})/i,

  // Formats voisins du label
  /(?:EXP|VALID|SCAD|VENC|G[ÜU]LT)[^0-9]{0,10}(\d{1,2}[-\.\/]\d{1,2}[-\.\/]\d{2,4})/i,
  
  // Dates formatées (DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY)
  /\b(\d{2}[-\/.]\d{2}[-\/.]\d{4})\b/,
  /\b(\d{1,2}\s+(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{4})\b/i,
]

const MONTH_MAP: Record<string, string> = {
  JAN: '01', JANVIER: '01', JANUARY: '01',
  FEB: '02', FEVRIER: '02', FÉVRIER: '02', FEBRUARY: '02',
  MAR: '03', MARS: '03', MARCH: '03',
  APR: '04', AVRIL: '04', APRIL: '04',
  MAY: '05', MAI: '05',
  JUN: '06', JUIN: '06', JUNE: '06',
  JUL: '07', JUILLET: '07', JULY: '07',
  AUG: '08', AOUT: '08', AOÛT: '08', AUGUST: '08',
  SEP: '09', SEPTEMBRE: '09', SEPTEMBER: '09',
  OCT: '10', OCTOBRE: '10', OCTOBER: '10',
  NOV: '11', NOVEMBRE: '11', NOVEMBER: '11',
  DEC: '12', DECEMBRE: '12', DÉCEMBRE: '12', DECEMBER: '12',
  // Spanish
  ENE: '01', ENERO: '01',
  FEBRERO: '02',
  MARZO: '03',
  ABR: '04', ABRIL: '04',
  MAYO: '05',
  JUNIO: '06',
  JULIO: '07',
  AGO: '08', AGOSTO: '08',
  SEPTIEMBRE: '09', SETIEMBRE: '09',
  OCTUBRE: '10',
  NOVIEMBRE: '11',
  DIC: '12', DICIEMBRE: '12',
  // Portuguese
  JANEIRO: '01',
  FEV: '02', FEVEREIRO: '02',
  MARCO: '03', MARÇO: '03',
  SET: '09', SETEMBRO: '09',
  OUT: '10', OUTUBRO: '10',
  DEZ: '12', DEZEMBRO: '12',
  // German
  JANUAR: '01',
  FEBRUAR: '02',
  MRZ: '03', MÄRZ: '03', MAERZ: '03',
  JUNI: '06',
  JULI: '07',
  OKTOBER: '10',
  DEZEMBER: '12',
  // Italian
  GENNAIO: '01',
  FEBBRAIO: '02',
  APRILE: '04',
  MAGGIO: '05',
  GIUGNO: '06',
  LUGLIO: '07',
  SETTEMBRE: '09',
  OTTOBRE: '10',
  DICEMBRE: '12',
}

/**
 * Détecte le pays d'émission depuis le texte
 */
function detectIssuingCountry(text: string): string | undefined {
  const upperText = text.toUpperCase()
  // Normalisation légère des confusions OCR: 0->O, 1->I
  const normalized = upperText.replace(/0/g, 'O').replace(/1/g, 'I')
  
  // Recherche avec labels explicites d'abord
  const labelPatterns = [
    /(?:ISSUING\s+COUNTRY|PAYS\s+(?:ÉMETTEUR|EMETTEUR|D'ÉMISSION))[:\s-]*([A-Z\s'-]+?)(?=\n|PASSPORT|PASSEPORT|NO\b|N°|$)/i,
    /(?:COUNTRY\s+OF\s+ISSUE|ISSUED\s+BY)[:\s-]*([A-Z\s'-]+?)(?=\n|PASSPORT|NO\b|$)/i,
  ]
  
  for (const pattern of labelPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const countryText = match[1].trim()
      // Vérifier si ce texte correspond à un pays connu
      for (const [regex, fullName, code] of COUNTRY_PATTERNS) {
        if (regex.test(countryText)) {
          return code // Retourner le code ISO 2 lettres
        }
      }
    }
  }
  
  // Recherche générale dans tout le texte
  for (const [regex, fullName, code] of COUNTRY_PATTERNS) {
    if (regex.test(upperText) || regex.test(normalized)) {
      return code // Retourner le code ISO 2 lettres
    }
  }
  
  return undefined
}

/**
 * Détecte la ville d'émission depuis le texte
 */
function detectIssuingCity(text: string): string | undefined {
  const upperText = text.toUpperCase()
  const normalized = upperText.replace(/0/g, 'O').replace(/1/g, 'I')
  
  // Recherche avec labels explicites
  const labelPatterns = [
    /(?:CITY\s+OF\s+ISSUE|LIEU\s+DE\s+(?:DÉLIVRANCE|DELIVRANCE)|ISSUED\s+(?:AT|IN)|DÉLIVRÉ\s+À)[:\s-]*([A-Z\s'-]+?)(?=\n|$)/i,
  ]
  
  for (const pattern of labelPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const cityText = match[1].trim()
      // Vérifier si c'est une ville connue
      for (const [regex, cityName] of CITY_PATTERNS) {
        if (regex.test(cityText)) {
          return cityName
        }
      }
      // Si pas de correspondance exacte, retourner le texte nettoyé
      if (cityText.length > 2 && cityText.length < 30) {
        return cityText.replace(/\s{2,}/g, ' ')
      }
    }
  }
  
  // Recherche de villes connues dans tout le texte
  for (const [regex, cityName] of CITY_PATTERNS) {
    if (regex.test(upperText) || regex.test(normalized)) {
      return cityName
    }
  }
  
  return undefined
}

/**
 * Extrait le numéro d'identité depuis le texte
 * Se base sur les labels spécifiques : NUMEROCNI, NIC NUMBER, PASSPORT No, etc.
 */
function extractIdNumber(text: string, docType: string): string {
  const lines = text.split(/\r?\n/).map(l => l.trim())
  
  console.log('🔍 Recherche du numéro d\'identité...')
  
  // Parcourir chaque ligne pour trouver le label puis extraire le numéro
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const upperLine = line.toUpperCase()
    
    // Passeport: labels FR/EN possibles — si le numéro n'est pas sur la même ligne, prendre la ligne juste en dessous
    if (/(?:PASSPORT\s*NO\.?|NO\.?\s*PASSPORT|N°\s*(?:DE\s*)?PASSEPORT|PASSEPORT\s*N°|PASSPORT\s*NUMBER)/i.test(line)) {
      // même ligne
      const same = line.match(/(?:PASSPORT\s*NO\.?|NO\.?\s*PASSPORT|N°\s*(?:DE\s*)?PASSEPORT|PASSEPORT\s*N°|PASSPORT\s*NUMBER)[:\s]*([A-Z0-9\s-]{5,20})/i)
      if (same?.[1]) {
        const n = normalizeIdNumberCandidate(same[1])
        if (n.length >= 6 && /\d/.test(n)) return n
      }
      // lignes suivantes (jusqu'à 3)
      for (let k = 1; k <= 3 && i + k < lines.length; k++) {
        const next = lines[i + k]
        const m = next.match(/([A-Z0-9\s-]{5,20})/)
        if (m?.[1]) {
          const n = normalizeIdNumberCandidate(m[1])
          if (n.length >= 6 && /\d/.test(n)) return n
        }
      }
    }

    // Pour CNI : chercher NUMEROCNI / NIC NUMBER
    if (/NUMEROCNI|NIC\s*NUMBER|N°\s*CNI|NO\s*CNI/i.test(line)) {
      console.log(`📌 Label CNI trouvé à la ligne ${i}: "${line}"`)
      
      // Extraire le numéro sur la même ligne
      const sameLineMatch = line.match(/(?:NUMEROCNI|NIC\s*NUMBER|N°\s*CNI|NO\s*CNI)[:\s]*([A-Z0-9\s-]{6,20})/i)
      if (sameLineMatch && sameLineMatch[1]) {
        const number = sameLineMatch[1].replace(/[\s-]/g, '').trim()
        if (number.length >= 6 && /\d/.test(number)) {
          console.log(`✅ Numéro CNI extrait (même ligne): ${number}`)
          return number
        }
      }
      
      // Si pas trouvé sur la même ligne, chercher sur la ligne suivante
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1]
        const nextLineMatch = nextLine.match(/([A-Z0-9\s-]{6,20})/)
        if (nextLineMatch && nextLineMatch[1]) {
          const number = nextLineMatch[1].replace(/[\s-]/g, '').trim()
          if (number.length >= 6 && /\d/.test(number)) {
            console.log(`✅ Numéro CNI extrait (ligne suivante): ${number}`)
            return number
          }
        }
      }
    }
    
    // l'ancien bloc Passport est remplacé par le bloc en tête ci-dessus
  }
  
  // Fallback : essayer les patterns globaux si aucun label spécifique trouvé
  console.log('⚠️ Aucun label spécifique trouvé, utilisation du fallback...')
  
  for (const pattern of ID_NUMBER_PATTERNS) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const candidate = normalizeIdNumberCandidate(match[1])
      // Valider que le candidat contient au moins un chiffre et a une longueur minimale
      if (/\d/.test(candidate) && candidate.length >= 6) {
        console.log(`✅ Numéro extrait via fallback: ${candidate}`)
        return candidate
      }
    }
  }
  
  // Dernier balayage: chercher une séquence plausible proche des labels "Passport" même sans deux-points
  const nearPassport = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .reduce<string[]>((acc, l, idx, arr) => {
      if (/PASSPORT|PASSEPORT/i.test(l)) {
        acc.push(l)
        if (arr[idx + 1]) acc.push(arr[idx + 1])
        if (arr[idx + 2]) acc.push(arr[idx + 2])
      }
      return acc
    }, [])
    .join(' ')
  const loose = nearPassport.match(/([A-Z0-9][A-Z0-9\-\s]{5,20})/)
  if (loose?.[1]) {
    const candidate = normalizeIdNumberCandidate(loose[1])
    if (/\d/.test(candidate) && candidate.length >= 6) {
      console.log(`✅ Numéro extrait via balayage libre: ${candidate}`)
      return candidate
    }
  }
  
  console.log('❌ Aucun numéro d\'identité trouvé')
  return ''
}

/**
 * Normalise une date vers le format ISO (YYYY-MM-DD)
 */
function normalizeDate(dateStr: string): string | undefined {
  if (!dateStr) return undefined
  
  // Format: DD/MM/YYYY ou DD-MM-YYYY
  const slashMatch = dateStr.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/)
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0')
    const month = slashMatch[2].padStart(2, '0')
    let year = slashMatch[3]
    
    // Convertir année à 2 chiffres en 4 chiffres
    if (year.length === 2) {
      const yy = parseInt(year)
      year = yy > 50 ? `19${year}` : `20${year}`
    }
    
    return `${year}-${month}-${day}`
  }
  
  // Format: DD MONTH YYYY (ex: 15 JAN 2025)
  const monthMatch = dateStr.match(/(\d{1,2})\s+([A-ZÉÈÛ]+)\s+(\d{4})/i)
  if (monthMatch) {
    const day = monthMatch[1].padStart(2, '0')
    const monthStr = monthMatch[2].toUpperCase()
    const year = monthMatch[3]
    
    // Chercher le mois dans la map
    let month = MONTH_MAP[monthStr]
    if (!month) {
      // Essayer avec les 3 premières lettres
      const shortMonth = monthStr.substring(0, 3)
      month = MONTH_MAP[shortMonth]
    }
    
    if (month) {
      return `${year}-${month}-${day}`
    }
  }
  
  return undefined
}

// Formatte une date ISO (YYYY-MM-DD) vers DD/MM/YYYY pour l'UI
function formatIsoToDDMMYYYY(iso: string | undefined): string | undefined {
  if (!iso) return undefined
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return undefined
  const [, y, mo, d] = m
  return `${d}/${mo}/${y}`
}

// Détecte une date d'expiration faible/suspecte (placeholders 01/01 ou 00/00)
function isWeakExpiryDate(value?: string): boolean {
  if (!value) return true
  const v = value.trim()
  // Formats DD/MM/YYYY ou ISO YYYY-MM-DD
  if (/^(?:00|01)\/(?:00|01)\/\d{4}$/.test(v)) return true
  if (/^\d{2}\/\d{2}\/0000$/.test(v)) return true
  if (/^\d{4}-(?:00|01)-(?:00|01)$/.test(v)) return true
  if (/^0000-\d{2}-\d{2}$/.test(v)) return true
  return false
}

// Normalise un candidat de numéro d'identité pour corriger les confusions OCR courantes
function normalizeIdNumberCandidate(raw: string): string {
  if (!raw) return ''
  let v = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  // Corrections OCR fréquentes
  v = v.replace(/O/g, '0') // O -> 0
       .replace(/Q/g, '0') // Q -> 0
       .replace(/[IL]/g, '1') // I,l -> 1
       .replace(/S/g, '5') // S -> 5
       .replace(/B/g, '8') // B -> 8
       .replace(/Z/g, '2') // Z -> 2
       .replace(/G/g, '6') // G -> 6
  return v
}

/**
 * Extrait la date d'expiration depuis le texte
 */
function extractExpiryDate(text: string): string | undefined {
  // 1) Lecture préférentielle: ligne sous le label (FR/EN/ES/PT/DE/IT)
  const lines = text.split(/\r?\n/).map(l => l.trim())
  const expiryLabel = /(?:DATE\s+OF\s+EXPIRY|EXPIRY\s*DATE|DATE\s+D'?EXPIRATION|DATE\s+DE\s+VALIDIT\xC9|VALID(?:ITY|IT\xC9)|VENCE|VALIDADE|SCADENZA|G[ÜU]LTIG\s+BIS|DATE.*EXPIR)/i
  for (let i = 0; i < lines.length; i++) {
    if (expiryLabel.test(lines[i])) {
      // Chercher sur la même ligne d'abord, puis jusqu'à 2 lignes sous le label
      const candidates: string[] = []
      // Inclure la ligne précédente aussi (certains gabarits mettent la date avant le label)
      if (lines[i - 1]) candidates.push(lines[i - 1])
      candidates.push(lines[i])
      if (lines[i + 1]) candidates.push(lines[i + 1])
      if (lines[i + 2]) candidates.push(lines[i + 2])

      for (const cand of candidates) {
        const m = cand.match(/([0-9]{1,2}[-\.\/][0-9]{1,2}[-\.\/][0-9]{2,4}|[0-9]{1,2}\s+[A-Z\p{L}]{3,}\s+[0-9]{4})/iu)
        if (m?.[1]) {
          const normalized = normalizeDate(m[1])
          if (normalized) {
            const expiryDate = new Date(normalized)
            const maxFuture = new Date(); maxFuture.setFullYear(maxFuture.getFullYear() + 50)
            const maxPast = new Date(); maxPast.setFullYear(maxPast.getFullYear() - 2)
            if (expiryDate >= maxPast && expiryDate <= maxFuture) {
              const fmt = formatIsoToDDMMYYYY(normalized) || normalized
              // Si la date semble un placeholder (01/01), garder la valeur brute si elle existe
              if (isWeakExpiryDate(fmt)) return m[1].replace(/[.]/g, '/').replace(/\s+/g, ' ').trim()
              return fmt
            }
          } else {
            // Retour brut si non normalisable (ex: 00.00.0000)
            return m[1].replace(/[.]/g, '/').replace(/\s+/g, ' ').trim()
          }
        }
      }
    }
  }

  // 2) Fallback: patterns globaux
  for (const pattern of EXPIRY_DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const normalized = normalizeDate(match[1])
      if (normalized) {
        const expiryDate = new Date(normalized)
        const maxFuture = new Date(); maxFuture.setFullYear(maxFuture.getFullYear() + 50)
        const maxPast = new Date(); maxPast.setFullYear(maxPast.getFullYear() - 2)
        if (expiryDate >= maxPast && expiryDate <= maxFuture) {
          const fmt = formatIsoToDDMMYYYY(normalized) || normalized
          if (isWeakExpiryDate(fmt)) continue
          return fmt
        }
      }
    }
  }
  
  // 3) Dernier recours: chercher toutes les dates plausibles et retourner la plus récente (souvent l'expiration)
  const allDateMatches: string[] = []
  const globalPatterns = [
    /(\d{1,2}[-\.\/]\d{1,2}[-\.\/]\d{2,4})/g,
    /(\d{1,2}\s+[A-Z\p{L}]{3,}\s+\d{4})/giu,
  ]
  for (const gp of globalPatterns) {
    let m: RegExpExecArray | null
    while ((m = gp.exec(text)) !== null) {
      if (m[1]) allDateMatches.push(m[1])
    }
  }
  if (allDateMatches.length > 0) {
    let best: { d: Date; raw: string; norm: string | undefined } | null = null
    const maxFuture = new Date(); maxFuture.setFullYear(maxFuture.getFullYear() + 50)
    const maxPast = new Date(); maxPast.setFullYear(maxPast.getFullYear() - 2)
    for (const raw of allDateMatches) {
      const norm = normalizeDate(raw)
      if (norm) {
        const d = new Date(norm)
        if (d >= maxPast && d <= maxFuture) {
          if (!best || d > best.d) best = { d, raw, norm }
      }
    }
  }
    if (best) {
      const fmt = formatIsoToDDMMYYYY(best.norm!) || best.norm!
      if (!isWeakExpiryDate(fmt)) return fmt
    }
    // Si aucune normalisable: retourner une occurrence brute (ex: 00.00.0000) formatée
    const zeroLike = allDateMatches.find(v => /\b\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\b/.test(v))
    if (zeroLike) return zeroLike.replace(/[.]/g, '/').trim()
  }
  
  return undefined
}

/**
 * Prétraitement de l'image pour améliorer l'OCR
 */
function preprocessImage(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Conversion en niveaux de gris et augmentation du contraste
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    const contrast = 1.5
    const value = ((avg - 128) * contrast) + 128
    const finalValue = Math.max(0, Math.min(255, value))
    data[i] = data[i + 1] = data[i + 2] = finalValue
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

/**
 * Détecte le type de document
 */
function detectDocumentType(text: string): 'Passport' | 'ID Card' | 'Visa' | 'Unknown' {
  const upperText = text.toUpperCase()
  
  // MRZ entêtes (prioritaire)
  if (/^[P]<[A-Z]{3}/m.test(upperText)) {
    return 'Passport'
  }
  if (/^[I][<|<]{1}[A-Z]{3}/m.test(upperText)) {
    return 'ID Card'
  }
  if (/^[V][<|<]{1}[A-Z]{3}/m.test(upperText)) {
    return 'Visa'
  }

  // Mots-clés
  if (upperText.includes('PASSPORT') || upperText.includes('PASSEPORT')) {
    return 'Passport'
  }
  if (upperText.includes('CARTE') || upperText.includes('IDENTITY') || upperText.includes('CNI')) {
    return 'ID Card'
  }
  if (upperText.includes('VISA')) {
    return 'Visa'
  }
  
  return 'Unknown'
}

/**
 * Parse la zone MRZ (Machine Readable Zone)
 */
function parseMRZ(text: string): Partial<ExtractedIdData> {
  const lines = text.split(/\r?\n/).map(l => l.trim())
  const mrzLines = lines.filter(line => /^[A-Z0-9<]{20,}$/.test(line))
  if (mrzLines.length < 2) return {}
  
  const data: Partial<ExtractedIdData> = {}
  
  const first = mrzLines[0]

  // Passeport TD3 (P<...) 2 lignes
  if (/^P<[A-Z]{3}/.test(first)) {
  const line1 = mrzLines[0]
  const line2 = mrzLines[mrzLines.length - 1]
  
  const nameMatch = line1.match(/P<([A-Z]{3})([A-Z<]+)<<([A-Z<]+)/)
  if (nameMatch) {
    data.issuingCountry = nameMatch[1]
    data.lastName = nameMatch[2].replace(/</g, ' ').trim()
    data.firstName = nameMatch[3].replace(/</g, ' ').trim()
  }
  
  const dataMatch = line2.match(/([A-Z0-9]{9})\d([A-Z]{3})(\d{6})\d([MF<])(\d{6})/)
  if (dataMatch) {
    data.idNumber = dataMatch[1].replace(/</g, '')
    data.nationality = dataMatch[2]
    
    const dobYY = dataMatch[3].substring(0, 2)
    const dobMM = dataMatch[3].substring(2, 4)
    const dobDD = dataMatch[3].substring(4, 6)
    const dobYear = parseInt(dobYY) > 50 ? `19${dobYY}` : `20${dobYY}`
    data.dateOfBirth = `${dobYear}-${dobMM}-${dobDD}`
    
    const expYY = dataMatch[5].substring(0, 2)
    const expMM = dataMatch[5].substring(2, 4)
    const expDD = dataMatch[5].substring(4, 6)
    const expYear = parseInt(expYY) > 50 ? `19${expYY}` : `20${expYY}`
    data.idExpiryDate = `${expYear}-${expMM}-${expDD}`
  }
    return data
  }

  // Carte d'identité TD1 (I<...) 3 lignes
  if (/^I<[A-Z]{3}/.test(first) && mrzLines.length >= 2) {
    const l1 = mrzLines[0]
    const l2 = mrzLines[1]
    const iso = l1.match(/^I<([A-Z]{3})/)
    if (iso) data.issuingCountry = iso[1]
    const afterHeader = l1.slice(5)
    const num = afterHeader.replace(/</g, ' ').match(/([A-Z0-9]{5,15})/)
    if (num) data.idNumber = num[1].replace(/</g, '')
    // L2: YYMMDD check, sex, YYMMDD
    const m2 = l2.match(/^(\d{6})\d([MF<])(\d{6})/)
    if (m2) {
      const exp = m2[3]
      const yy = exp.substring(0, 2)
      const mm = exp.substring(2, 4)
      const dd = exp.substring(4, 6)
      const year = parseInt(yy) > 50 ? `19${yy}` : `20${yy}`
      data.idExpiryDate = `${year}-${mm}-${dd}`
    }
    return data
  }

  // Visa V< ... — au moins pays émetteur
  if (/^V<[A-Z]{3}/.test(first)) {
    const iso = first.match(/^V<([A-Z]{3})/)
    if (iso) data.issuingCountry = iso[1]
    return data
  }
  
  return data
}

/**
 * Fonction principale d'extraction OCR
 */
export async function extractIdDataLocal(
  imageSource: string | File | HTMLImageElement | HTMLCanvasElement,
  onProgress?: (progress: number) => void
): Promise<ExtractedIdData> {
  try {
    console.log('🔍 Début de l\'extraction OCR locale (optimisée)...')

    // 1) Normaliser la source vers un canvas
    const sourceToCanvas = (src: string | File | HTMLImageElement | HTMLCanvasElement): Promise<HTMLCanvasElement> => {
      return new Promise((resolve, reject) => {
        if (src instanceof HTMLCanvasElement) return resolve(src)
        if (src instanceof HTMLImageElement) {
          const c = document.createElement('canvas')
          c.width = src.naturalWidth || src.width
          c.height = src.naturalHeight || src.height
          const ctx = c.getContext('2d')!
          ctx.drawImage(src, 0, 0)
          return resolve(c)
        }
        const img = new Image()
        img.crossOrigin = 'anonymous'
        const finalize = () => {
          const c = document.createElement('canvas')
          c.width = img.naturalWidth
          c.height = img.naturalHeight
          const ctx = c.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          resolve(c)
        }
        img.onerror = () => reject(new Error('Erreur de chargement de l\'image'))
        if (typeof src === 'string') {
          img.src = src
        } else {
          const reader = new FileReader()
          reader.onload = e => {
            img.src = e.target?.result as string
          }
          reader.onerror = () => reject(new Error('Erreur lecture fichier image'))
          reader.readAsDataURL(src)
        }
        img.onload = finalize
      })
    }

    let baseCanvas = await sourceToCanvas(imageSource)

    // 2) Prétraitement + redimensionnement
    baseCanvas = preprocessImage(baseCanvas)
    baseCanvas = resizeToMax(baseCanvas, 1600)

    // 3) Détection d'orientation via worker (si dispo)
    await ensureLanguage('eng+fra')
    const worker = await getOcrWorker()
    try {
      if (typeof worker.detect === 'function') {
        const det = await worker.detect(baseCanvas)
        const angle = Math.round(
          // v6 types: det.data.orientation_degrees; fallback to older path if any
          (det?.data?.orientation_degrees ?? det?.data?.orientation?.degrees ?? 0) as number,
        )
        if (angle && angle % 360 !== 0) {
          baseCanvas = rotateCanvas(baseCanvas, angle)
        }
      }
    } catch {}

    // Données de sortie
    const out: ExtractedIdData = { idType: 'Unknown', idNumber: '', firstName: '', lastName: '' }

    // 4) Passage MRZ ciblé (bas du document), charset restreint
    try {
      const mrzZone = cropBottom(baseCanvas, 0.38)
      const mrzText = await recognizeText(
        mrzZone,
        {
          tessedit_pageseg_mode: '6',
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        },
        onProgress,
      )
      const mrzData = parseMRZ(mrzText)
      Object.assign(out, mrzData)
      if (mrzText) {
        const docType = detectDocumentType(mrzText)
        if (docType && docType !== 'Unknown') out.idType = docType
      }
    } catch {}

    // 4bis) Tentative MRZ verticale (bande droite) utile pour certaines CNI
    try {
      if (!out.idNumber || !out.idExpiryDate || !out.issuingCountry) {
        const cropRight = (src: HTMLCanvasElement, ratio = 0.34): HTMLCanvasElement => {
          const w = Math.round(src.width * ratio)
          const x = src.width - w
          const dst = document.createElement('canvas')
          dst.width = w
          dst.height = src.height
          const ctx = dst.getContext('2d')!
          ctx.drawImage(src, x, 0, w, src.height, 0, 0, w, src.height)
          return dst
        }
        let rightBand = cropRight(baseCanvas, 0.32)
        rightBand = rotateCanvas(rightBand, -90)
        const mrzTextRight = await recognizeText(
          rightBand,
          {
            tessedit_pageseg_mode: '6',
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
          },
          onProgress,
        )
        const mrzDataRight = parseMRZ(mrzTextRight)
        Object.assign(out, mrzDataRight)
        if (mrzTextRight) {
          const docTypeR = detectDocumentType(mrzTextRight)
          if (docTypeR && docTypeR !== 'Unknown') out.idType = docTypeR
        }
      }
    } catch {}

    // 5) Si informations manquantes, passage général unique sur la page complète
    if (!out.idNumber || !out.idExpiryDate || !out.issuingCountry || !out.issuingCity) {
      // Important: réinitialiser la whitelist pour la reconnaissance générale
      await worker.setParameters({
        tessedit_pageseg_mode: '6',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist: '',
      })
      const fullText = await recognizeText(baseCanvas, undefined, onProgress, { rotateAuto: true })
      if (out.idType === 'Unknown') out.idType = detectDocumentType(fullText)
      if (!out.issuingCountry) out.issuingCountry = detectIssuingCountry(fullText)
      if (!out.issuingCity) out.issuingCity = detectIssuingCity(fullText)
      if (!out.idNumber) out.idNumber = extractIdNumber(fullText, out.idType)
      if (!out.idExpiryDate) out.idExpiryDate = extractExpiryDate(fullText)
    }

    console.log('✅ Données extraites (optimisées):', out)
    return out
    
  } catch (error) {
    console.error('❌ Erreur OCR:', error)
    throw new Error('Échec de l\'extraction des données')
  }
}

/**
 * Version optimisée avec prétraitement
 */
export async function extractIdDataWithPreprocessing(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<ExtractedIdData> {
  // La version prétraitée utilise désormais le pipeline optimisé unique
  return extractIdDataLocal(imageFile, onProgress)
}

/**
 * Version simplifiée sans prétraitement
 */
export async function extractIdDataSimple(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<ExtractedIdData> {
  return extractIdDataLocal(imageFile, onProgress)
}