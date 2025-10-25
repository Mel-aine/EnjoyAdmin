// utils/taxCalculations.ts

export interface Tax {
  id: number
  name: string
  rate: string
  percent: string
  type: 'flat_percentage' | 'flat_amount'
}

export interface TaxBreakdown {
  taxId: number
  taxName: string
  amount: number
  type: string
}

export interface RoomItemWithTax {
  roomId: number
  roomName: string
  planName: string
  planPrice: number // Prix TTC (avec taxes incluses)
  quantity: number
  nights: number
  subtotal: number
  taxIncluded: boolean
}

export interface TaxCalculationResult {
  total: number // Total des taxes à afficher
  breakdown: TaxBreakdown[]
  hasItemsWithTaxIncluded: boolean
  hasItemsWithoutTax: boolean
  totalWithTaxIncluded: number // Total TTC des items avec taxe incluse
  totalWithoutTax: number // Total HT des items sans taxe incluse
  roomChargesHT: number // Total HT (hors taxes) pour tous les items
  extractedTaxes: number // Taxes extraites des prix TTC
}

/**
 * Extrait les taxes d'un prix TTC
 * Formule: Prix HT = Prix TTC / (1 + taux_total)
 */
function extractTaxesFromPrice(priceTTC: number, taxes: Tax[], nights: number, quantity: number): {
  priceHT: number
  extractedTaxes: number
  breakdown: TaxBreakdown[]
} {
  // Calculer le taux total de taxation (uniquement les pourcentages)
  let totalTaxRate = 0
  const percentageTaxes = taxes.filter(t => t.type === 'flat_percentage')
  const flatAmountTaxes = taxes.filter(t => t.type === 'flat_amount')

  percentageTaxes.forEach(tax => {
    totalTaxRate += parseFloat(tax.percent) / 100
  })

  // Prix HT = Prix TTC / (1 + taux)
  let priceHT = priceTTC
  const breakdown: TaxBreakdown[] = []
  let extractedTaxes = 0

  // 1. Extraire les taxes en pourcentage du prix TTC
  if (totalTaxRate > 0) {
    priceHT = priceTTC / (1 + totalTaxRate)
    const taxAmount = priceTTC - priceHT

    // Répartir proportionnellement entre les taxes
    percentageTaxes.forEach(tax => {
      const taxPercent = parseFloat(tax.percent) / 100
      const taxShare = (taxPercent / totalTaxRate) * taxAmount

      breakdown.push({
        taxId: tax.id,
        taxName: tax.name,
        amount: Math.round(taxShare),
        type: tax.type
      })

      extractedTaxes += taxShare
    })
  }

  // 2. Ajouter les taxes flat (par chambre/nuit) si elles existent
  flatAmountTaxes.forEach(tax => {
    const flatRate = parseFloat(tax.rate)
    const taxAmount = flatRate * nights * quantity

    breakdown.push({
      taxId: tax.id,
      taxName: tax.name,
      amount: Math.round(taxAmount),
      type: tax.type
    })

    extractedTaxes += taxAmount
  })

  return {
    priceHT: Math.round(priceHT),
    extractedTaxes: Math.round(extractedTaxes),
    breakdown
  }
}

/**
 * Calcule les taxes pour tous les items du panier
 */
export function calculateCartTaxes(
  items: any[],
  taxes: Tax[],
  nights: number
): TaxCalculationResult {
  // Séparer les items selon leur statut de taxe
  const itemsWithTaxIncluded = items.filter(item => item.taxIncluded === true)
  const itemsWithoutTax = items.filter(item => item.taxIncluded !== true)

  let roomChargesHT = 0
  let extractedTaxes = 0
  const allBreakdown: TaxBreakdown[] = []

  // 1. Traiter les items AVEC taxes incluses (extraire les taxes)
  itemsWithTaxIncluded.forEach(item => {
    const result = extractTaxesFromPrice(
      item.subtotal,
      taxes,
      nights,
      item.quantity
    )

    roomChargesHT += result.priceHT
    extractedTaxes += result.extractedTaxes

    // Fusionner les breakdowns
    result.breakdown.forEach(newTax => {
      const existing = allBreakdown.find(t => t.taxId === newTax.taxId)
      if (existing) {
        existing.amount += newTax.amount
      } else {
        allBreakdown.push({ ...newTax })
      }
    })
  })

  // 2. Traiter les items SANS taxes incluses (calculer les taxes)
  const totalWithoutTax = itemsWithoutTax.reduce((sum, item) => sum + item.subtotal, 0)
  const totalRoomsWithoutTax = itemsWithoutTax.reduce((sum, item) => sum + item.quantity, 0)

  roomChargesHT += totalWithoutTax
  let taxesOnItemsWithoutTax = 0

  if (totalWithoutTax > 0) {
    taxes.forEach(tax => {
      let taxAmount = 0

      if (tax.type === 'flat_percentage') {
        const percent = parseFloat(tax.percent) / 100
        taxAmount = totalWithoutTax * percent
      } else if (tax.type === 'flat_amount') {
        const flatRate = parseFloat(tax.rate)
        taxAmount = flatRate * nights * totalRoomsWithoutTax
      }

      taxesOnItemsWithoutTax += taxAmount

      const existing = allBreakdown.find(t => t.taxId === tax.id)
      if (existing) {
        existing.amount += Math.round(taxAmount)
      } else {
        allBreakdown.push({
          taxId: tax.id,
          taxName: tax.name,
          amount: Math.round(taxAmount),
          type: tax.type
        })
      }
    })
  }

  // Le total des taxes affiché = taxes extraites + taxes calculées
  const totalTaxes = extractedTaxes + taxesOnItemsWithoutTax

  return {
    total: Math.round(totalTaxes),
    breakdown: allBreakdown.map(b => ({
      ...b,
      amount: Math.round(b.amount)
    })),
    hasItemsWithTaxIncluded: itemsWithTaxIncluded.length > 0,
    hasItemsWithoutTax: itemsWithoutTax.length > 0,
    totalWithTaxIncluded: itemsWithTaxIncluded.reduce((sum, item) => sum + item.subtotal, 0),
    totalWithoutTax: totalWithoutTax,
    roomChargesHT: Math.round(roomChargesHT),
    extractedTaxes: Math.round(extractedTaxes)
  }
}

/**
 * Formate l'affichage d'une taxe
 */
export function formatTaxLabel(tax?: Tax): string {
  if (!tax) return 'Tax'

  if (tax.type === 'flat_percentage') {
    return `${tax.name} (${tax.percent}%)`
  } else if (tax.type === 'flat_amount') {
    return `${tax.name} (${tax.rate} per room/night)`
  }
  return tax.name
}

/**
 * Génère les informations d'affichage des taxes
 */
export function getTaxDisplayInfo(
  hasItemsWithTaxIncluded: boolean,
  hasItemsWithoutTax: boolean,
  taxRate: number,
  itemsWithoutTaxCount: number,
  itemsWithTaxCount: number
) {
  if (hasItemsWithTaxIncluded && !hasItemsWithoutTax) {
    return {
      label: `Taxes (${taxRate * 100}% included in price)`,
      isIncluded: true,
      showAmount: true,
      note: 'Taxes are included in the displayed price'
    }
  }

  if (hasItemsWithTaxIncluded && hasItemsWithoutTax) {
    return {
      label: `Taxes (${taxRate * 100}%)`,
      isIncluded: false,
      showAmount: true,
      note: `${itemsWithTaxCount} room(s) with tax included, ${itemsWithoutTaxCount} without`
    }
  }

  return {
    label: `Taxes & Fees (${taxRate * 100}%)`,
    isIncluded: false,
    showAmount: true,
    note: null
  }
}
