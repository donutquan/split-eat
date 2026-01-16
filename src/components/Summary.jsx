import {
    calculateItemSubtotal,
    calculateItemsSubtotal,
    getFlatDiscountAmount,
    getPercentageDiscountAmount,
    getSCAmount,
    getTaxAmount,
    calculateAfterFirstDiscount,
    calculateAfterSC,
    calculateAfterTax,
    calculateFinalTotal,
    isCustomQuantityValid
} from '../utils/calculations'

export const Summary = ({
    diners,
    foodItems,
    calculatePersonTotal,
    getPersonItems,
    togglePersonExpanded,
    expandAllPersons,
    collapseAllPersons,
    expandedPersons,
    getDinerDisplayName,
    getSharedByAllItems,
    scEnabled,
    scRate,
    taxEnabled,
    taxRate,
    discountFlat,
    discountFlatValue,
    discountPercentage,
    discountPercentageValue,
    discountTiming,
    hasAnyDiscount
}) => {
    const itemsSubtotal = calculateItemsSubtotal(foodItems)
    const afterFirstDiscount = calculateAfterFirstDiscount(itemsSubtotal, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue)
    const scAmount = getSCAmount(afterFirstDiscount, scEnabled, scRate)
    const afterSC = calculateAfterSC(afterFirstDiscount, scEnabled, scRate)
    const taxAmount = getTaxAmount(afterSC, taxEnabled, taxRate)
    const afterTax = calculateAfterTax(afterSC, taxEnabled, taxRate)
    const finalTotal = calculateFinalTotal(afterTax, 'after', discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue)

    return (
        <div className="summaries-container">
            {/* Per-Person Section */}
            <section className="glass-card">
                <div className="section-header-row">
                    <h2 className="section-title">💰 Who owes what?</h2>
                </div>
                <div className="person-summaries">
                    {diners.map((diner, index) => {
                        const personTotal = calculatePersonTotal(diner.id)
                        const personItems = getPersonItems(diner.id)
                        const isExpanded = expandedPersons.includes(diner.id)

                        return (
                            <div key={diner.id} className="person-summary-card">
                                <button className="person-header" onClick={() => togglePersonExpanded(diner.id)}>
                                    <div className="person-info">
                                        <span className="person-name">{getDinerDisplayName(diner, index)}</span>
                                        {personItems.length > 0 && (
                                            <span className="person-item-count">: {personItems.length} item{personItems.length !== 1 ? 's' : ''}</span>
                                        )}
                                    </div>
                                    <div className="person-amount-wrapper">
                                        <span className="person-amount">${personTotal.toFixed(2)} </span>
                                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="person-items-list">
                                        {personItems.map(pItem => {
                                            let calculation = ''
                                            if (pItem.useCustomSplit && isCustomQuantityValid(pItem)) {
                                                const personQty = pItem.customQuantities[diner.id] || 0
                                                const totalQty = parseFloat(pItem.quantity) || 0
                                                calculation = `${personQty.toFixed(1)}/${totalQty.toFixed(1)} × $${pItem.itemSubtotal.toFixed(2)} = $${pItem.share.toFixed(2)}`
                                            } else {
                                                calculation = `$${pItem.itemSubtotal.toFixed(2)} ÷ ${pItem.assignedDinerIds.length} = $${pItem.share.toFixed(2)}`
                                            }

                                            return (
                                                <div key={pItem.id} className="person-item">
                                                    <div className="person-item-name">{pItem.foodName || 'Unnamed item'}</div>
                                                    <div className="person-item-calculation">{calculation}</div>
                                                </div>
                                            )
                                        })}
                                        {personItems.length === 0 && <p className="empty-state-small">No items assigned yet</p>}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {getSharedByAllItems().length > 0 && (
                    <div className="shared-by-all-section">
                        <h3 className="shared-title">🍽️ Shared by Everyone</h3>
                        <div className="shared-items-list">
                            {getSharedByAllItems().map(item => (
                                <div key={item.id} className="shared-item">
                                    <span className="shared-item-name">{item.foodName || 'Unnamed item'}</span>
                                    <span className="shared-item-total">${calculateItemSubtotal(item).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Breakdown Section */}
            <section className="glass-card">
                <h2 className="section-title">📊 Final Breakdown</h2>
                <div className="summary-row">
                    <span className="summary-label">Items Subtotal</span>
                    <span className="summary-value">${itemsSubtotal.toFixed(2)}</span>
                </div>

                {discountTiming === 'before' && (
                    <>
                        {discountFlat && (
                            <div className="summary-row summary-intermediate">
                                <span className="summary-label">Flat Discount (${discountFlatValue.toFixed(2)})</span>
                                <span className="summary-value">-${getFlatDiscountAmount('before', discountFlat, discountFlatValue, discountTiming, itemsSubtotal).toFixed(2)}</span>
                            </div>
                        )}
                        {discountPercentage && (
                            <div className="summary-row summary-intermediate">
                                <span className="summary-label">Percentage Discount ({discountPercentageValue}%)</span>
                                <span className="summary-value">-${getPercentageDiscountAmount('before', discountPercentage, discountPercentageValue, discountTiming, discountFlat, discountFlatValue, itemsSubtotal).toFixed(2)}</span>
                            </div>
                        )}
                        {hasAnyDiscount && (
                            <>
                                <div className="summary-breakdown-divider"></div>
                                <div className="summary-row summary-intermediate">
                                    <span className="summary-label">After Discount</span>
                                    <span className="summary-value">${afterFirstDiscount.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </>
                )}

                {scEnabled && (
                    <>
                        <div className="summary-row summary-intermediate">
                            <span className="summary-label">Service Charge ({scRate}%)</span>
                            <span className="summary-value">${scAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-breakdown-divider"></div>
                    </>
                )}

                {taxEnabled && (
                    <>
                        <div className="summary-row summary-intermediate">
                            <span className="summary-label">Tax ({taxRate}%)</span>
                            <span className="summary-value">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-breakdown-divider"></div>
                    </>
                )}

                {discountTiming === 'after' && (
                    <>
                        {discountFlat && (
                            <div className="summary-row summary-intermediate">
                                <span className="summary-label">Flat Discount (${discountFlatValue.toFixed(2)})</span>
                                <span className="summary-value">-${getFlatDiscountAmount('after', discountFlat, discountFlatValue, discountTiming, afterTax).toFixed(2)}</span>
                            </div>
                        )}
                        {discountPercentage && (
                            <div className="summary-row summary-intermediate">
                                <span className="summary-label">Percentage Discount ({discountPercentageValue}%)</span>
                                <span className="summary-value">-${getPercentageDiscountAmount('after', discountPercentage, discountPercentageValue, discountTiming, discountFlat, discountFlatValue, afterTax).toFixed(2)}</span>
                            </div>
                        )}
                    </>
                )}

                <div className="summary-divider"></div>
                <div className="summary-row final-total-row">
                    <span className="summary-label">Final Total</span>
                    <span className="summary-value final-total">${finalTotal.toFixed(2)}</span>
                </div>
            </section>
        </div>
    )
}
