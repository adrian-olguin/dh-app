const ONE_TIME_VARIANT_ID = "49959534887214";
const MONTHLY_VARIANT_ID = "49970972492078";

export type DonationFrequency = "oneTime" | "monthly";

export function buildDonationUrl(
  frequency: DonationFrequency,
  amountDollars: number,
  locale?: string
): string {
  const quantity = Math.max(1, Math.round(amountDollars)); // safety
  const variantId =
    frequency === "monthly" ? MONTHLY_VARIANT_ID : ONE_TIME_VARIANT_ID;

  const base = `https://giving.pastorrick.com/cart/${variantId}:${quantity}`;

  // If a locale is provided (e.g. "es-us"), append it as a query param
  return locale ? `${base}?locale=${encodeURIComponent(locale)}` : base;
}
