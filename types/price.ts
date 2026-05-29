// ─── Currency ─────────────────────────────────────────────────────────────────

/** ISO 4217 currency code or common symbol */
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | string;

/** Human-readable symbol shown in the UI */
export type CurrencySymbol = '₹' | '$' | '€' | '£' | 'AED' | string;

export interface Currency {
    code: CurrencyCode;
    symbol: CurrencySymbol;
}

// ─── Tax ─────────────────────────────────────────────────────────────────────

export type TaxName = 'GST' | 'VAT' | 'Service Tax' | 'IGST' | string;

export interface ItemTax {
    /** Tax label shown on bill e.g. "GST", "VAT" */
    name: TaxName;
    /** Percentage rate e.g. 5, 12, 18 */
    rate: number;
    /**
     * Computed tax amount = base_price × (rate / 100).
     * Stored for audit trail — never recalculate from rate alone.
     */
    amount: number;
    /**
     * If true: base_price already includes tax (most Indian restaurant menus).
     * If false: tax is added on top of base_price at checkout.
     */
    inclusive: boolean;
}

// ─── Discount ─────────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';
export type DiscountOnType = 'basePrice' | 'priceIncludingTaxes';

export interface ItemDiscount {
    /** Is discount apply to the base price or the price including taxes */
    discountOn: DiscountOnType
    /** How the discount is calculated */
    type: DiscountType;
    /**
     * The discount value.
     * type='percentage' → 0–100 (e.g. 40 means 40% off)
     * type='fixed'      → absolute amount in the Item's currency (e.g. ₹50 off)
     */
    value: number;
    /**
    * Pre-computed discounted price stored for fast reads.
    * = base_price − (base_price × value/100)  for percentage
    * = base_price − value                      for fixed
    */
    discounted_price: number;
    /** Short label shown on the Item card e.g. "40% off 💚", "Happy Hours" */
    label?: string;
    /** ISO 8601 — offer starts at this time. Null = always active */
    valid_from?: string | null;
    /** ISO 8601 — offer expires at this time. Null = no expiry */
    valid_until?: string | null;
}

// ─── Core price ──────────────────────────────────────────────────────────────

export interface ItemPrice {
    /** The menu price of the Item before any discount */
    base_price: number;
    currency: Currency;
    /** Tax config — null if this Item is not taxed separately */
    tax: ItemTax | null;
    /** Active discount — null if no discount is running */
    discount: ItemDiscount | null;
    /**
     * The price the customer actually pays.
     * = discounted_price (if discount active) else base_price.
     * Always stored — never compute on the frontend.
     */
    final_price: number;
    /**
     * Original price shown crossed-out when a discount is active.
     * e.g. ~~₹400~~ ₹320
     * Null if no MRP to display (base_price IS the MRP).
     */
    mrp?: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** True if a discount is currently valid (time-bound check) */
export function isDiscountActive(discount: ItemDiscount | null): boolean {
    if (!discount) return false;
    const now = Date.now();
    const from = discount.valid_from ? new Date(discount.valid_from).getTime() : -Infinity;
    const until = discount.valid_until ? new Date(discount.valid_until).getTime() : Infinity;
    return now >= from && now <= until;
}

/** Format a price for display: symbol + amount to 2dp */
export function formatPrice(amount: number, currency: Currency): string {
    return `${currency.symbol}${amount.toFixed(2).replace(/\.00$/, '')}`;
}

/** Compute final price from a ItemPrice (does not mutate) */
export function computeFinalPrice(price: ItemPrice): number {
    if (!price.discount || !isDiscountActive(price.discount)) {
        return price.base_price;
    }
    const { type, value } = price.discount;
    if (type === 'percentage') {
        return parseFloat((price.base_price * (1 - value / 100)).toFixed(2));
    }
    return parseFloat((price.base_price - value).toFixed(2));
}