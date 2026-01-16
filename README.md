# 🍕 Split Eat!

**Bills split better, together.**

Split Eat is a modern, user-friendly web application designed to simplify the often complicated process of splitting restaurant bills among friends, family, or colleagues. Whether you're dining with two people or twenty, Split Eat makes fair bill division effortless and transparent.

## 🎯 Purpose

Ever struggled with calculating who owes what after a group dinner? Split Eat solves this problem by:

- **Fairly dividing costs** based on what each person actually ordered
- **Handling complex scenarios** like shared dishes, custom portions, service charges, taxes, and discounts
- **Providing transparency** with detailed breakdowns showing exactly how each person's total was calculated
- **Saving time** by automating calculations that would normally require a calculator and lots of manual math

## ✨ Key Features

### 👥 Flexible Diner Management
- Support for 1-20 diners
- Optional custom names for easy tracking
- Automatic fallback to "Person 1", "Person 2", etc.

### 🍱 Smart Food Item Tracking
- Add unlimited food items with unit price and quantity
- **Equal Split Mode**: Automatically divide items evenly among selected diners
- **Custom Split Mode**: Assign specific portions to each person (e.g., one person ate 2 pieces, another ate 1)
- Real-time validation to ensure custom quantities add up correctly
- Collapsible item cards to reduce scrolling

### 💵 Service Charge & Tax
- Toggle service charge on/off (default: 10%)
- Toggle tax on/off (default: 9%)
- Customizable rates (0-100%)
- Combined multiplier display for quick reference

### 🏷️ Dual Discount System
- **Flat Amount Discount**: Deduct a fixed dollar amount
- **Percentage Discount**: Apply a percentage reduction
- **Apply Both Simultaneously**: Use flat + percentage discounts together
- **Flexible Timing**: Choose to apply discounts before or after service charge & tax

### 💰 Detailed Per-Person Breakdown
- See exactly what each person owes
- Expandable cards showing individual item breakdowns
- Visual calculation display (e.g., "$15.00 ÷ 3 = $5.00")
- Special section highlighting items shared by everyone

### 📊 Transparent Summary
- Step-by-step breakdown of all charges
- Shows subtotal, discounts, service charge, tax, and final total
- Intermediate totals displayed for complete transparency
- Proportional distribution of all fees based on what each person ordered

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd split-eat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` directory.

## 🎨 Technology Stack

- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **nanoid** - Unique ID generation
- **CSS** - Custom styling with glassmorphism effects

## 💡 Usage Example

1. **Set up your group**: Enter the number of diners and optionally add names
2. **Add food items**: Input each dish with its price and quantity
3. **Assign who ate what**: Select which diners shared each item
4. **Customize portions** (optional): If someone ate more/less, use custom split
5. **Configure charges**: Adjust service charge, tax, and discounts as needed
6. **Review the breakdown**: See exactly who owes what and verify the calculations

## 🧮 How It Works

Split Eat uses a **proportional calculation system**:

1. Each person's share of the items subtotal is calculated first
2. Service charges, taxes, and discounts are applied to the total bill
3. Each person pays a proportional share of the final total based on their percentage of the items subtotal

This ensures that:
- Someone who ordered more expensive items pays proportionally more of the fees
- Shared items are divided fairly
- All charges (SC, tax, discounts) are distributed equitably
