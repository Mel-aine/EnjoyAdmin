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
  planPrice: number
  quantity: number
  adults: number
  children: number
  taxIncluded: boolean
}

export interface TaxCalculationResult {
  total: number
  breakdown: TaxBreakdown[]
  hasItemsWithTaxIncluded: boolean
  hasItemsWithoutTax: boolean
  totalWithTaxIncluded: number
  totalWithoutTax: number
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

  // Calculer les sous-totaux
  const totalWithTaxIncluded = itemsWithTaxIncluded.reduce((sum, item) => {
    return sum + (item.planPrice * item.quantity * nights)
  }, 0)

  const totalWithoutTax = itemsWithoutTax.reduce((sum, item) => {
    return sum + (item.planPrice * item.quantity * nights)
  }, 0)

  // Si tout est avec taxe incluse, retourner 0
  if (totalWithoutTax === 0) {
    return {
      total: 0,
      breakdown: [],
      hasItemsWithTaxIncluded: itemsWithTaxIncluded.length > 0,
      hasItemsWithoutTax: false,
      totalWithTaxIncluded,
      totalWithoutTax: 0
    }
  }

  // Calculer le nombre total de chambres sans taxe incluse
  const totalRoomsWithoutTax = itemsWithoutTax.reduce((sum, item) => sum + item.quantity, 0)

  // Calculer les taxes
  const breakdown: TaxBreakdown[] = []
  let totalTax = 0

  taxes.forEach(tax => {
    let taxAmount = 0

    if (tax.type === 'flat_percentage') {
      const percent = parseFloat(tax.percent) / 100
      taxAmount = totalWithoutTax * percent
    } else if (tax.type === 'flat_amount') {
      const flatRate = parseFloat(tax.rate)
      taxAmount = flatRate * nights * totalRoomsWithoutTax
    }

    totalTax += taxAmount

    breakdown.push({
      taxId: tax.id,
      taxName: tax.name,
      amount: Math.round(taxAmount),
      type: tax.type
    })
  })

  return {
    total: Math.round(totalTax),
    breakdown,
    hasItemsWithTaxIncluded: itemsWithTaxIncluded.length > 0,
    hasItemsWithoutTax: itemsWithoutTax.length > 0,
    totalWithTaxIncluded,
    totalWithoutTax
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
  // Cas 1: Toutes les taxes sont incluses
  if (hasItemsWithTaxIncluded && !hasItemsWithoutTax) {
    return {
      label: `Taxes (${taxRate * 100}% included)`,
      isIncluded: true,
      showAmount: false,
      note: null
    }
  }

  // Cas 2: Mix de taxes incluses et non incluses
  if (hasItemsWithTaxIncluded && hasItemsWithoutTax) {
    return {
      label: `Taxes (${taxRate * 100}%)`,
      isIncluded: false,
      showAmount: true,
      note: `${itemsWithTaxCount} room(s) with tax included, ${itemsWithoutTaxCount} without`
    }
  }

  // Cas 3: Aucune taxe incluse
  return {
    label: `Taxes & Fees (${taxRate * 100}%)`,
    isIncluded: false,
    showAmount: true,
    note: null
  }
}
