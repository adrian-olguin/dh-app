// src/lib/donations.ts

const ONE_TIME_VARIANT_ID = "49959534887214";
const MONTHLY_VARIANT_ID = "49970972492078";

type DonationFrequency = "oneTime" | "monthly";

export function buildDonationUrl(
  frequency: DonationFrequency,
  amountDollars: number
): string {
  const quantity = Math.max(1, Math.round(amountDollars)); // safety

  const variantId =
    frequency === "monthly" ? MONTHLY_VARIANT_ID : ONE_TIME_VARIANT_ID;

  return `https://giving.pastorrick.com/cart/${variantId}:${quantity}`;
}
