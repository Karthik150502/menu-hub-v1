// ─── Friendly per-table aliases over the generated database schema ────────────
// types/database.ts is auto-generated (raw snake_case Postgres shape) — this
// file is hand-maintained and just gives each table's Row/Insert/Update a
// short PascalCase name to import instead of `Tables<'dishes'>` etc.
//
// These are the RAW DB row shapes — not the same as the domain types in
// dish.ts / price.ts, which are camelCase DTOs the FastAPI backend serves
// over its API (and compute derived fields like finalPrice server-side).
// Reach for these only where the app talks to Supabase directly (currently
// just auth — see lib/supabase/auth.ts) or for admin/debug tooling.

import type { Tables, TablesInsert, TablesUpdate } from './database';
import { ItemPrice } from './price';

// ─── restaurants ────────────────────────────────────────────────────────────
export type RestaurantRow = Tables<'restaurants'>;
export type RestaurantInsert = TablesInsert<'restaurants'>;
export type RestaurantUpdate = TablesUpdate<'restaurants'>;

// ─── currencies ─────────────────────────────────────────────────────────────
export type CurrencyRow = Tables<'currencies'>;
export type CurrencyInsert = TablesInsert<'currencies'>;
export type CurrencyUpdate = TablesUpdate<'currencies'>;

// ─── item_taxes ─────────────────────────────────────────────────────────────
export type ItemTaxRow = Tables<'item_taxes'>;
export type ItemTaxInsert = TablesInsert<'item_taxes'>;
export type ItemTaxUpdate = TablesUpdate<'item_taxes'>;

// ─── tax_groups ─────────────────────────────────────────────────────────────
export type TaxGroupRow = Tables<'tax_groups'>;
export type TaxGroupInsert = TablesInsert<'tax_groups'>;
export type TaxGroupUpdate = TablesUpdate<'tax_groups'>;

// ─── tax_group_members ──────────────────────────────────────────────────────
export type TaxGroupMemberRow = Tables<'tax_group_members'>;
export type TaxGroupMemberInsert = TablesInsert<'tax_group_members'>;
export type TaxGroupMemberUpdate = TablesUpdate<'tax_group_members'>;

// ─── dishes ──────────────────────────────────────────────────────────────────
export type DishRow = Tables<'dishes'>;
export type DishInsert = TablesInsert<'dishes'>;
export type DishUpdate = TablesUpdate<'dishes'>;

// ─── item_prices ────────────────────────────────────────────────────────────
export type ItemPriceRow = Tables<'item_prices'>;
export type ItemPriceInsert = TablesInsert<'item_prices'>;
export type ItemPriceUpdate = TablesUpdate<'item_prices'>;

// ─── tax_line_items ─────────────────────────────────────────────────────────
export type TaxLineItemRow = Tables<'tax_line_items'>;
export type TaxLineItemInsert = TablesInsert<'tax_line_items'>;
export type TaxLineItemUpdate = TablesUpdate<'tax_line_items'>;

// ─── tax_line_item_groups ───────────────────────────────────────────────────
export type TaxLineItemGroupRow = Tables<'tax_line_item_groups'>;
export type TaxLineItemGroupInsert = TablesInsert<'tax_line_item_groups'>;
export type TaxLineItemGroupUpdate = TablesUpdate<'tax_line_item_groups'>;

// ─── tax_line_item_taxes ────────────────────────────────────────────────────
export type TaxLineItemTaxRow = Tables<'tax_line_item_taxes'>;
export type TaxLineItemTaxInsert = TablesInsert<'tax_line_item_taxes'>;
export type TaxLineItemTaxUpdate = TablesUpdate<'tax_line_item_taxes'>;