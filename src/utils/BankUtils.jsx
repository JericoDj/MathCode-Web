// src/utils/BankUtils.jsx
export function formatBankAccount(acc) {
  return String(acc).replace(/(.{4})/g, "$1 ").trim();
}