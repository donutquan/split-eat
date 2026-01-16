export const calculateItemSubtotal = (item) => {
    const price = parseFloat(item.unitPrice) || 0
    const qty = parseFloat(item.quantity) || 0
    return price * qty
}

export const calculateItemsSubtotal = (foodItems) => {
    return foodItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0)
}

export const getFlatDiscountAmount = (timing, discountFlat, discountFlatValue, discountTiming, baseAmount) => {
    if (!discountFlat || discountTiming !== timing) return 0
    return Math.min(discountFlatValue, baseAmount)
}

export const getPercentageDiscountAmount = (timing, discountPercentage, discountPercentageValue, discountTiming, discountFlat, discountFlatValue, baseAmount) => {
    if (!discountPercentage || discountTiming !== timing) return 0

    let amount = baseAmount
    if (discountFlat && discountFlatValue > 0) {
        amount = Math.max(0, amount - discountFlatValue)
    }

    return amount * (discountPercentageValue / 100)
}

export const calculateAfterDiscount = (amount, timing, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue) => {
    if (discountTiming !== timing) return amount

    let result = amount

    if (discountFlat && discountFlatValue > 0) {
        result = Math.max(0, result - discountFlatValue)
    }

    if (discountPercentage && discountPercentageValue > 0) {
        result = result * (1 - discountPercentageValue / 100)
    }

    return result
}

export const calculateAfterFirstDiscount = (itemsSubtotal, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue) => {
    return calculateAfterDiscount(itemsSubtotal, 'before', discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue)
}

export const calculateAfterSC = (afterFirstDiscount, scEnabled, scRate) => {
    return scEnabled ? afterFirstDiscount * (1 + scRate / 100) : afterFirstDiscount
}

export const calculateAfterTax = (afterSC, taxEnabled, taxRate) => {
    return taxEnabled ? afterSC * (1 + taxRate / 100) : afterSC
}

export const calculateFinalTotal = (afterTax, timing, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue) => {
    return calculateAfterDiscount(afterTax, timing, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue)
}

export const getSCAmount = (amount, scEnabled, scRate) => {
    if (!scEnabled) return 0
    return amount * (scRate / 100)
}

export const getTaxAmount = (afterSC, taxEnabled, taxRate) => {
    if (!taxEnabled) return 0
    return afterSC * (taxRate / 100)
}

export const getCombinedMultiplier = (scEnabled, scRate, taxEnabled, taxRate) => {
    let multiplier = 1
    if (scEnabled) multiplier *= (1 + scRate / 100)
    if (taxEnabled) multiplier *= (1 + taxRate / 100)
    return multiplier
}

export const isCustomQuantityValid = (item) => {
    if (!item.useCustomSplit) return true
    const total = Object.values(item.customQuantities || {}).reduce((sum, qty) => sum + qty, 0)
    const expected = parseFloat(item.quantity) || 0
    return Math.abs(total - expected) < 0.01
}
