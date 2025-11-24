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

export interface TaxCalculationResult {
  roomChargesHT: number
  roomChargesTTC: number
  extrasCost: number
  extractedTaxes: number
  taxesOnExtras: number
  flatTaxes: number
  totalTaxes: number
  grandTotal: number
  breakdown: TaxBreakdown[]

}

export function calculateCartTaxes(
  items: Array<{
    planPriceTTC?: number
    planPrice?: number
    totalExtrasCost?: number
    quantity: number
  }>,
  taxes: Tax[],
  nights: number
): TaxCalculationResult {

  const percentageTaxes = taxes.filter(t => t.type === 'flat_percentage')
  const flatAmountTaxes = taxes.filter(t => t.type === 'flat_amount')

  const totalPercentRate = percentageTaxes.reduce(
    (sum, t) => sum + parseFloat(t.percent || '0') / 100,
    0
  )

  let roomChargesTTC = 0
  let roomChargesHT = 0
  let extrasCost = 0
  let totalExtractedPercentageTax = 0
  let totalFlatTax = 0
  let taxesOnExtras = 0
  const breakdown: TaxBreakdown[] = []

  const totalRooms = items.reduce((sum, item) => sum + item.quantity, 0)

  flatAmountTaxes.forEach(tax => {
    const amount = parseFloat(tax.rate || '0') * totalRooms * nights
    totalFlatTax += amount

    breakdown.push({
      taxId: tax.id,
      taxName: tax.name,
      amount: Math.round(amount),
      type: tax.type
    })
  })

  items.forEach(item => {

    const unitPriceTTC = (item.planPriceTTC ?? item.planPrice ?? 0)
    const itemTotalTTC = unitPriceTTC * item.quantity * nights


    const itemShareOfFlatTax = (item.quantity / totalRooms) * totalFlatTax

    const baseSubjectToVat = itemTotalTTC - itemShareOfFlatTax

    const itemHT = totalPercentRate > 0 ? baseSubjectToVat / (1 + totalPercentRate) : baseSubjectToVat
    const itemPercentageTax = baseSubjectToVat - itemHT

    const itemExtrasBase = (item.totalExtrasCost || 0) * item.quantity * nights
    const itemExtrasTax = itemExtrasBase * totalPercentRate

    roomChargesTTC += itemTotalTTC
    roomChargesHT += itemHT
    extrasCost += itemExtrasBase
    totalExtractedPercentageTax += itemPercentageTax
    taxesOnExtras += itemExtrasTax
  })

  if (totalExtractedPercentageTax > 0 || taxesOnExtras > 0) {
    const globalPercentageTax = totalExtractedPercentageTax + taxesOnExtras

    percentageTaxes.forEach(tax => {
      const taxPercent = parseFloat(tax.percent || '0') / 100
      const share = (taxPercent / totalPercentRate) * globalPercentageTax

      const existing = breakdown.find(b => b.taxId === tax.id)
      if (existing) {
        existing.amount += Math.round(share)
      } else {
        breakdown.push({
          taxId: tax.id,
          taxName: tax.name,
          amount: Math.round(share),
          type: tax.type
        })
      }
    })
  }

  const totalTaxes = totalExtractedPercentageTax + taxesOnExtras + totalFlatTax

  const grandTotal = roomChargesTTC + extrasCost + taxesOnExtras

  return {
    roomChargesHT: Math.round(roomChargesHT),
    roomChargesTTC: Math.round(roomChargesTTC),
    extrasCost: Math.round(extrasCost),
    extractedTaxes: Math.round(totalExtractedPercentageTax),
    taxesOnExtras: Math.round(taxesOnExtras),
    flatTaxes: Math.round(totalFlatTax),
    totalTaxes: Math.round(totalTaxes),
    grandTotal: Math.round(grandTotal),
    breakdown
  }
}

export function formatTaxLabel(tax?: Tax): string {
  if (!tax) return 'Tax'
  if (tax.type === 'flat_percentage') {
    return `${tax.name} (${tax.percent}%)`
  } else if (tax.type === 'flat_amount') {
    return `${tax.name} (${tax.rate}/room/night)`
  }
  return tax.name
}
