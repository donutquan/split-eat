import { calculateItemSubtotal, calculateItemsSubtotal, isCustomQuantityValid } from '../utils/calculations'
import { Checkbox } from './UI/Input'

export const FoodForm = ({
    foodItems,
    diners,
    addFoodItem,
    removeFoodItem,
    updateFoodItem,
    toggleFoodItemExpanded,
    toggleCustomSplit,
    updateCustomQuantity,
    toggleDinerAssignment,
    selectAllDiners,
    clearAllDiners,
    getDinerDisplayName
}) => {
    return (
        <>
            {foodItems.length === 0 && (
                <p className="empty-state">No items yet. Click "+ Add Item" to start!</p>
            )}

            {foodItems.map((item, itemIndex) => (
                <div key={item.id} className="food-item-card">
                    <div className="food-item-header">
                        <button
                            className="food-item-header-btn"
                            onClick={() => toggleFoodItemExpanded(item.id)}
                        >
                            <span className="food-item-number">
                                Item {itemIndex + 1}{item.foodName ? `: ${item.foodName}` : ''}
                            </span>
                            <span className={`section-chevron ${item.isExpanded ? 'expanded' : ''}`}>▼</span>
                        </button>
                        <button
                            onClick={() => removeFoodItem(item.id)}
                            className="btn-delete"
                            aria-label="Delete item"
                        >
                            🗑️
                        </button>
                    </div>

                    {item.isExpanded && (
                        <div className="food-item-content">
                            <div className="food-item-inputs">
                                <input
                                    type="text"
                                    value={item.foodName}
                                    onChange={(e) => updateFoodItem(item.id, 'foodName', e.target.value)}
                                    placeholder="Food name"
                                    className="input-field"
                                />

                                <div className="input-row">
                                    <input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateFoodItem(item.id, 'unitPrice', e.target.value)}
                                        placeholder="Unit price"
                                        step="0.01"
                                        className="input-field input-small"
                                    />
                                    <span className="input-separator">×</span>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateFoodItem(item.id, 'quantity', e.target.value)}
                                        placeholder="Qty"
                                        step="0.1"
                                        className="input-field input-small"
                                    />
                                </div>

                                <div className="item-subtotal">
                                    Subtotal: ${calculateItemSubtotal(item).toFixed(2)}
                                </div>
                            </div>

                            {parseFloat(item.quantity) > 1 && (
                                <div className="custom-split-toggle">
                                    <Checkbox
                                        label="Custom Split Quantities"
                                        checked={item.useCustomSplit}
                                        onChange={() => toggleCustomSplit(item.id)}
                                    >
                                        {item.useCustomSplit && (
                                            <div className="quantity-validation">
                                                Total: {Object.values(item.customQuantities || {}).reduce((sum, qty) => sum + qty, 0).toFixed(1)} / {parseFloat(item.quantity).toFixed(1)}
                                                {isCustomQuantityValid(item) ? ' ✓' : ' ⚠️'}
                                            </div>
                                        )}
                                    </Checkbox>
                                </div>
                            )}

                            <div className="assignment-section">
                                <div className="assignment-header">
                                    <span className="assignment-label">🤝 Who's sharing this?</span>
                                    <div className="assignment-actions">
                                        <button onClick={() => selectAllDiners(item.id)} className="btn-text">Select All</button>
                                        <button onClick={() => clearAllDiners(item.id)} className="btn-text">Clear</button>
                                    </div>
                                </div>

                                <div className={item.useCustomSplit ? "checkbox-grid-custom" : "checkbox-grid"}>
                                    {diners.map((diner, index) => (
                                        <label key={diner.id} className={item.useCustomSplit ? "checkbox-label-custom" : "checkbox-label"}>
                                            <input
                                                type="checkbox"
                                                checked={item.assignedDinerIds.includes(diner.id)}
                                                onChange={() => toggleDinerAssignment(item.id, diner.id)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-text">{getDinerDisplayName(diner, index)}</span>
                                            {item.useCustomSplit && item.assignedDinerIds.includes(diner.id) && (
                                                <input
                                                    type="number"
                                                    value={item.customQuantities[diner.id] || 0}
                                                    onChange={(e) => updateCustomQuantity(item.id, diner.id, e.target.value)}
                                                    step="0.1"
                                                    min="0"
                                                    className="custom-quantity-input"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {!isCustomQuantityValid(item) && item.useCustomSplit && (
                                    <div className="quantity-warning">⚠️ Total quantities must equal {parseFloat(item.quantity).toFixed(1)}</div>
                                )}

                                {item.assignedDinerIds.length === 0 && (
                                    <div className="warning-message">⚠️ No one assigned yet</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button onClick={addFoodItem} className="btn-add-item">+Add Item</button>

            {foodItems.length > 0 && (
                <div className="items-subtotal">
                    <span className="subtotal-label">Items Subtotal</span>
                    <span className="subtotal-amount">${calculateItemsSubtotal(foodItems).toFixed(2)}</span>
                </div>
            )}
        </>
    )
}
