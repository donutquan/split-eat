import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import logo from './assets/logo.png'
import './index.css'

// Internal Components
import { Section } from './components/UI/Section'
import { PaxForm } from './components/PaxForm'
import { FoodForm } from './components/FoodForm'
import { ConfigForm } from './components/ConfigForm'
import { Summary } from './components/Summary'

// Utilities
import * as calc from './utils/calculations'

function App() {
  const [numDiners, setNumDiners] = useState(2)
  const [diners, setDiners] = useState([
    { id: nanoid(), name: '' },
    { id: nanoid(), name: '' }
  ])
  const [foodItems, setFoodItems] = useState([])
  const [expandedPersons, setExpandedPersons] = useState([])

  // Collapsible sections state
  const [isPaxExpanded, setIsPaxExpanded] = useState(true)
  const [isFoodExpanded, setIsFoodExpanded] = useState(true)
  const [isScExpanded, setIsScExpanded] = useState(true)

  // Service Charge & Tax
  const [scEnabled, setScEnabled] = useState(true)
  const [scRate, setScRate] = useState(10)
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [taxRate, setTaxRate] = useState(9)

  // Discount
  const [discountFlat, setDiscountFlat] = useState(false)
  const [discountFlatValue, setDiscountFlatValue] = useState(0)
  const [discountPercentage, setDiscountPercentage] = useState(false)
  const [discountPercentageValue, setDiscountPercentageValue] = useState(0)
  const [discountTiming, setDiscountTiming] = useState('before')

  // Auto-adjust diners array when numDiners changes
  useEffect(() => {
    const current = diners.length
    if (numDiners > current) {
      const newDiners = Array.from({ length: numDiners - current }, () => ({
        id: nanoid(),
        name: ''
      }))
      setDiners([...diners, ...newDiners])
    } else if (numDiners < current) {
      setDiners(diners.slice(0, numDiners))
    }
  }, [numDiners])

  const updateDinerName = (id, name) => {
    setDiners(diners.map(d => d.id === id ? { ...d, name } : d))
  }

  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      {
        id: nanoid(),
        foodName: '',
        unitPrice: '',
        quantity: '',
        assignedDinerIds: [],
        useCustomSplit: false,
        customQuantities: {},
        isExpanded: true
      }
    ])
  }

  const removeFoodItem = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id))
  }

  const updateFoodItem = (id, field, value) => {
    setFoodItems(foodItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const toggleFoodItemExpanded = (itemId) => {
    setFoodItems(foodItems.map(item =>
      item.id === itemId ? { ...item, isExpanded: !item.isExpanded } : item
    ))
  }

  const toggleCustomSplit = (itemId) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === itemId) {
        const newUseCustomSplit = !item.useCustomSplit
        if (newUseCustomSplit) {
          const qty = parseFloat(item.quantity) || 0
          const numAssigned = item.assignedDinerIds.length
          const perPerson = numAssigned > 0 ? qty / numAssigned : 0
          const customQuantities = {}
          item.assignedDinerIds.forEach(dinerId => {
            customQuantities[dinerId] = perPerson
          })
          return { ...item, useCustomSplit: true, customQuantities }
        } else {
          return { ...item, useCustomSplit: false, customQuantities: {} }
        }
      }
      return item
    }))
  }

  const updateCustomQuantity = (itemId, dinerId, quantity) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          customQuantities: {
            ...item.customQuantities,
            [dinerId]: parseFloat(quantity) || 0
          }
        }
      }
      return item
    }))
  }

  const toggleDinerAssignment = (itemId, dinerId) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === itemId) {
        const isAssigned = item.assignedDinerIds.includes(dinerId)
        const newAssignedIds = isAssigned
          ? item.assignedDinerIds.filter(id => id !== dinerId)
          : [...item.assignedDinerIds, dinerId]

        let newCustomQuantities = { ...item.customQuantities }
        if (item.useCustomSplit) {
          if (isAssigned) {
            delete newCustomQuantities[dinerId]
          } else {
            const currentTotal = Object.values(item.customQuantities || {}).reduce((sum, q) => sum + q, 0)
            const expectedTotal = parseFloat(item.quantity) || 0
            newCustomQuantities[dinerId] = Math.max(0, expectedTotal - currentTotal)
          }
        }
        return { ...item, assignedDinerIds: newAssignedIds, customQuantities: newCustomQuantities }
      }
      return item
    }))
  }

  const selectAllDiners = (itemId) => {
    setFoodItems(foodItems.map(item => {
      if (item.id === itemId) {
        const allDinerIds = diners.map(d => d.id)
        let newCustomQuantities = { ...item.customQuantities }
        if (item.useCustomSplit) {
          const qty = parseFloat(item.quantity) || 0
          const perPerson = qty / diners.length
          newCustomQuantities = {}
          allDinerIds.forEach(dinerId => {
            newCustomQuantities[dinerId] = perPerson
          })
        }
        return { ...item, assignedDinerIds: allDinerIds, customQuantities: newCustomQuantities }
      }
      return item
    }))
  }

  const clearAllDiners = (itemId) => {
    setFoodItems(foodItems.map(item =>
      item.id === itemId ? { ...item, assignedDinerIds: [], customQuantities: {} } : item
    ))
  }

  const hasAnyDiscount = (discountFlat && discountFlatValue > 0) || (discountPercentage && discountPercentageValue > 0)

  const calculatePersonTotal = (dinerId) => {
    const itemsSubtotal = calc.calculateItemsSubtotal(foodItems)
    if (itemsSubtotal === 0) return 0

    const personItemsTotal = foodItems.reduce((total, item) => {
      if (item.assignedDinerIds.includes(dinerId)) {
        const itemSubtotal = calc.calculateItemSubtotal(item)
        if (item.useCustomSplit && calc.isCustomQuantityValid(item)) {
          const totalQty = parseFloat(item.quantity) || 0
          const personQty = item.customQuantities[dinerId] || 0
          return total + (totalQty > 0 ? (itemSubtotal * personQty / totalQty) : 0)
        } else {
          const numAssigned = item.assignedDinerIds.length
          return total + (numAssigned > 0 ? itemSubtotal / numAssigned : 0)
        }
      }
      return total
    }, 0)

    const afterTax = calc.calculateAfterTax(
      calc.calculateAfterSC(
        calc.calculateAfterFirstDiscount(itemsSubtotal, discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue),
        scEnabled, scRate
      ),
      taxEnabled, taxRate
    )

    const finalTotal = calc.calculateFinalTotal(afterTax, 'after', discountTiming, discountFlat, discountFlatValue, discountPercentage, discountPercentageValue)
    return (personItemsTotal / itemsSubtotal) * finalTotal
  }

  const getPersonItems = (dinerId) => {
    return foodItems
      .filter(item => item.assignedDinerIds.includes(dinerId))
      .map(item => {
        const itemSubtotal = calc.calculateItemSubtotal(item)
        let share = 0
        if (item.useCustomSplit && calc.isCustomQuantityValid(item)) {
          const totalQty = parseFloat(item.quantity) || 0
          const personQty = item.customQuantities[dinerId] || 0
          share = totalQty > 0 ? (itemSubtotal * personQty / totalQty) : 0
        } else {
          share = itemSubtotal / item.assignedDinerIds.length
        }
        return { ...item, itemSubtotal, share }
      })
  }

  const getSharedByAllItems = () => {
    if (diners.length === 0) return []
    return foodItems.filter(item =>
      item.assignedDinerIds.length === diners.length &&
      diners.every(d => item.assignedDinerIds.includes(d.id))
    )
  }

  const togglePersonExpanded = (dinerId) => {
    setExpandedPersons(prev =>
      prev.includes(dinerId)
        ? prev.filter(id => id !== dinerId)
        : [...prev, dinerId]
    )
  }

  // const expandAllPersons = () => {
  //   setExpandedPersons(diners.map(d => d.id))
  // }

  // const collapseAllPersons = () => {
  //   setExpandedPersons([])
  // }

  const getDinerDisplayName = (diner, index) => {
    return diner.name || `Person ${index + 1}`
  }

  return (
    <div className="app-container">
      <header>
        <img src={logo} alt="Split Eat Logo" className="app-logo" />
        <h1>Split Eat!</h1>
        <p className="hero-subtitle">Bills split better, together. 🍕</p>
      </header>

      <Section title="Who's dining?" icon="👥" isExpanded={isPaxExpanded} onToggle={() => setIsPaxExpanded(!isPaxExpanded)}>
        <PaxForm diners={diners} numDiners={numDiners} setNumDiners={setNumDiners} updateDinerName={updateDinerName} />
      </Section>

      <Section title="What did you order?" icon="🍱" isExpanded={isFoodExpanded} onToggle={() => setIsFoodExpanded(!isFoodExpanded)}>
        <FoodForm
          foodItems={foodItems}
          diners={diners}
          addFoodItem={addFoodItem}
          removeFoodItem={removeFoodItem}
          updateFoodItem={updateFoodItem}
          toggleFoodItemExpanded={toggleFoodItemExpanded}
          toggleCustomSplit={toggleCustomSplit}
          updateCustomQuantity={updateCustomQuantity}
          toggleDinerAssignment={toggleDinerAssignment}
          selectAllDiners={selectAllDiners}
          clearAllDiners={clearAllDiners}
          getDinerDisplayName={getDinerDisplayName}
        />
      </Section>

      <Section title="Service Charge, Tax & Discounts" icon="💵" isExpanded={isScExpanded} onToggle={() => setIsScExpanded(!isScExpanded)}>
        <ConfigForm
          scEnabled={scEnabled} setScEnabled={setScEnabled} scRate={scRate} setScRate={setScRate}
          taxEnabled={taxEnabled} setTaxEnabled={setTaxEnabled} taxRate={taxRate} setTaxRate={setTaxRate}
          discountFlat={discountFlat} setDiscountFlat={setDiscountFlat} discountFlatValue={discountFlatValue} setDiscountFlatValue={setDiscountFlatValue}
          discountPercentage={discountPercentage} setDiscountPercentage={setDiscountPercentage} discountPercentageValue={discountPercentageValue} setDiscountPercentageValue={setDiscountPercentageValue}
          discountTiming={discountTiming} setDiscountTiming={setDiscountTiming}
          hasAnyDiscount={hasAnyDiscount}
        />
      </Section>

      {foodItems.length > 0 && diners.length > 0 && (
        <Summary
          diners={diners}
          foodItems={foodItems}
          calculatePersonTotal={calculatePersonTotal}
          getPersonItems={getPersonItems}
          togglePersonExpanded={togglePersonExpanded}
          expandedPersons={expandedPersons}
          getDinerDisplayName={getDinerDisplayName}
          getSharedByAllItems={getSharedByAllItems}
          scEnabled={scEnabled}
          scRate={scRate}
          taxEnabled={taxEnabled}
          taxRate={taxRate}
          discountFlat={discountFlat}
          discountFlatValue={discountFlatValue}
          discountPercentage={discountPercentage}
          discountPercentageValue={discountPercentageValue}
          discountTiming={discountTiming}
          hasAnyDiscount={hasAnyDiscount}
        />
      )}
    </div>
  )
}

export default App
