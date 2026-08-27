// ─── Building blocks ──────────────────────────────────────────────────────────

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | string;
export type CurrencySymbol = '₹' | '$' | '€' | '£' | 'AED' | string;

export interface Currency {
    code: CurrencyCode;
    symbol: CurrencySymbol;
}

// ─── ItemTax ──────────────────────────────────────────────────────────────────
// A single, reusable tax rule stored in the catalogue.

export interface ItemTax {
    id: string;
    name: string;   // "GST", "CGST", "SGST", "Service Charge"
    rate: number;   // percentage, e.g. 2.5, 5, 18
    inclusive: boolean;  // true = already in displayed price
    description?: string;
}

// ─── TaxGroup ─────────────────────────────────────────────────────────────────
// A named bundle of ItemTaxes. One group can be referenced by many dishes.
// e.g. "Restaurant Standard" = [CGST 2.5% + SGST 2.5%]

export interface TaxGroup {
    id: string;
    name: string;   // "Restaurant Standard", "Liquor"
    description?: string;
    taxes: ItemTax[];
    /** Pre-computed sum of member rates — for display only */
    combinedRate: number;
}

// ─── TaxLineItem ──────────────────────────────────────────────────────────────
// The single tax configuration attached to one ItemPrice.
// Can hold any mix of standalone ItemTaxes and/or TaxGroups.
// References the ItemPrice it belongs to via itemPriceId.
//
// Example: a dish with a group (CGST+SGST) AND a standalone packaging cess:
//   groups: [restaurantStandard]
//   taxes:  [packagingCess]
//
// Example: a dish with only individually selected taxes:
//   groups: []
//   taxes:  [cgst, sgst, serviceCharge]
//
// Example: a dish with multiple groups (rare but supported):
//   groups: [baseGroup, stateSpecialGroup]
//   taxes:  []

export interface TaxLineItem {
    id: string;
    /** The ItemPrice this line item belongs to */
    itemPriceId: string;
    /** Zero or more TaxGroups applied to this price */
    groups: TaxGroup[];
    /** Zero or more individually applied ItemTaxes (outside any group) */
    taxes: ItemTax[];

    /**
     * Computed amounts keyed by the source ID (ItemTax.id or TaxGroup.id).
     * Stored for audit and receipt rendering — never recalculate at read time.
     *
     * For a group the key is the group ID; for an individual tax it's the tax ID.
     * Use flattenTaxLines() to expand group entries into per-member lines.
     */
    computedAmounts: Record<string, number>;

    /** Sum of all computedAmounts — stored for fast access */
    totalTaxAmount: number;
}

// ─── ItemPrice ────────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';
export type DiscountOnType = 'basePrice' | 'priceIncludingTaxes';


export interface Discount {
    type: DiscountType;
    on: DiscountOnType;
    value: number;
    label?: string;
    validFrom?: string | null;
    validUntil?: string | null;
}

export interface ItemPrice {
    id: string;
    basePrice: number;
    currency: Currency;

    /**
     * The single TaxLineItem for this price — holds all groups + individual taxes.
     * Null = untaxed item.
     */
    taxLineItem: TaxLineItem | null;

    /** Mirrors TaxLineItem.totalTaxAmount for fast access without joining */
    totalTaxAmount: number;

    finalPrice: number;
    mrp?: number | null;

    discount: Discount | null;   // null = no discount — unambiguous
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Whether the discount on a price is currently active */
export function isDiscountActive(price: ItemPrice): boolean {
    if (!price.discount) return false;
    const now = Date.now();
    const from = price.discount?.validFrom
        ? new Date(price.discount?.validFrom).getTime() : -Infinity;
    const until = price.discount?.validUntil
        ? new Date(price.discount.validUntil).getTime() : Infinity;
    return now >= from && now <= until;
}

/** "₹192" or "$15.50" */
export function formatPrice(amount: number, currency: Currency): string {
    return `${currency.symbol}${amount.toFixed(2).replace(/\.00$/, '')}`;
}

/**
 * Expand a TaxLineItem into flat { name, rate, amount } lines for a receipt.
 * Group entries are expanded into one line per member tax.
 */
export function flattenTaxLines(
    lineItem: TaxLineItem | null,
): { id: string; name: string; rate: number; amount: number }[] {
    if (!lineItem) return [];

    const lines: { id: string; name: string; rate: number; amount: number }[] = [];

    for (const group of lineItem.groups) {
        // Distribute the group's total amount evenly across its members
        // using each member's rate as a weight (standard apportionment)
        const groupTotal = lineItem.computedAmounts[group.id] ?? 0;
        const totalRate = group.combinedRate || 1;
        for (const tax of group.taxes) {
            lines.push({
                id: tax.id,
                name: tax.name,
                rate: tax.rate,
                amount: parseFloat(((tax.rate / totalRate) * groupTotal).toFixed(2)),
            });
        }
    }

    for (const tax of lineItem.taxes) {
        lines.push({
            id: tax.id,
            name: tax.name,
            rate: tax.rate,
            amount: lineItem.computedAmounts[tax.id] ?? 0,
        });
    }

    return lines;
}

/**
 * Compute the total tax amount from a TaxLineItem against a taxable base.
 * Used for live preview in the form — don't use for stored values.
 */
export function computeTotalTax(lineItem: TaxLineItem | null, taxableBase: number): number {
    if (!lineItem) return 0;

    let total = 0;

    for (const group of lineItem.groups) {
        for (const tax of group.taxes) {
            if (!tax.inclusive) total += taxableBase * (tax.rate / 100);
        }
    }
    for (const tax of lineItem.taxes) {
        if (!tax.inclusive) total += taxableBase * (tax.rate / 100);
    }

    return parseFloat(total.toFixed(2));
}

/**
 * Compute final price for live form preview.
 * The stored ItemPrice.finalPrice is the source of truth for everything else.
 */
export function computeFinalPrice(price: ItemPrice): number {
    if (!isDiscountActive(price)) return price.basePrice;

    const base = price.discount?.on === 'priceIncludingTaxes'
        ? price.basePrice + price.totalTaxAmount
        : price.basePrice;

    const discounted = price.discount?.type === 'percentage'
        ? base * (1 - price.discount?.value / 100)
        : base - price.discount?.value!;

    return parseFloat(discounted.toFixed(2));
}