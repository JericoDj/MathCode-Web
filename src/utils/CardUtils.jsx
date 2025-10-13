export const detectCardType = (number) => {
  const cleaned = number.replace(/\D/g, "");

  const cardPatterns = {
    visa: /^4[0-9]{6,}$/,
    mastercard: /^5[1-5][0-9]{5,}$/,
    amex: /^3[47][0-9]{5,}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
  };

  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleaned)) return type;
  }

  return "unknown";
};
