import { getCombinedMultiplier } from '../utils/calculations'
import { Checkbox } from './UI/Input'

export const ConfigForm = ({
    scEnabled, setScEnabled, scRate, setScRate,
    taxEnabled, setTaxEnabled, taxRate, setTaxRate,
    discountFlat, setDiscountFlat, discountFlatValue, setDiscountFlatValue,
    discountPercentage, setDiscountPercentage, discountPercentageValue, setDiscountPercentageValue,
    discountTiming, setDiscountTiming,
    hasAnyDiscount
}) => {
    return (
        <div className="config-sections">
            {/* SC & Tax Section */}
            <div className="config-group">
                <div className="config-row">
                    <Checkbox label="Service Charge" checked={scEnabled} onChange={(e) => setScEnabled(e.target.checked)} />
                    <div className="rate-input-wrapper">
                        <input
                            type="number"
                            value={scRate}
                            onChange={(e) => setScRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                            disabled={!scEnabled}
                            className="rate-input"
                        />
                        <span className="rate-unit">%</span>
                    </div>
                </div>

                <div className="config-row">
                    <Checkbox label="Tax" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} />
                    <div className="rate-input-wrapper">
                        <input
                            type="number"
                            value={taxRate}
                            onChange={(e) => setTaxRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                            disabled={!taxEnabled}
                            className="rate-input"
                        />
                        <span className="rate-unit">%</span>
                    </div>
                </div>

                {(scEnabled || taxEnabled) && (
                    <div className="multiplier-display">Combined multiplier: × {getCombinedMultiplier(scEnabled, scRate, taxEnabled, taxRate).toFixed(3)}</div>
                )}
            </div>

            {/* Discount Section */}
            <div className="config-group" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px dashed rgba(0,0,0,0.1)' }}>
                <h3 className="input-label" style={{ marginBottom: '16px' }}>🏷️ Discounts</h3>
                <div className="checkbox-group">
                    <Checkbox label="Flat Amount" checked={discountFlat} onChange={(e) => setDiscountFlat(e.target.checked)}>
                        {discountFlat && (
                            <div className="discount-input-wrapper">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    value={discountFlatValue}
                                    onChange={(e) => setDiscountFlatValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="discount-input"
                                />
                            </div>
                        )}
                    </Checkbox>

                    <Checkbox label="Percentage" checked={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.checked)}>
                        {discountPercentage && (
                            <div className="discount-input-wrapper">
                                <input
                                    type="number"
                                    value={discountPercentageValue}
                                    onChange={(e) => setDiscountPercentageValue(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                                    className="discount-input"
                                />
                                <span className="rate-unit">%</span>
                            </div>
                        )}
                    </Checkbox>
                </div>

                {hasAnyDiscount && (
                    <div className="discount-timing">
                        <label className="timing-label">Apply discount:</label>
                        <div className="timing-options">
                            <label className="radio-label-inline">
                                <input type="radio" name="discountTiming" value="before" checked={discountTiming === 'before'} onChange={(e) => setDiscountTiming(e.target.value)} />
                                <span className="radio-text">Before SC & Tax</span>
                            </label>
                            <label className="radio-label-inline">
                                <input type="radio" name="discountTiming" value="after" checked={discountTiming === 'after'} onChange={(e) => setDiscountTiming(e.target.value)} />
                                <span className="radio-text">After SC & Tax</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
