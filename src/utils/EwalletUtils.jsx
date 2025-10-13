// src/utils/EwalletUtils.jsx
export const EWALLETS = ["GCash", "Maya", "GrabPay"];

export function validateEwalletId(provider, id) {
  if (!provider || !id) return false;
  // simple checks per provider can be added here
  return true;
}
