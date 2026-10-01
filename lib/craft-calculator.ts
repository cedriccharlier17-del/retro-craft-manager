export type RecipeLine = { resourceId: number; name: string; quantity: number; stock: number; unitPrice: number };

export function calculateCraft(lines: RecipeLine[], craftQuantity = 1) {
  return lines.map((line) => {
    const needed = line.quantity * craftQuantity;
    const missing = Math.max(0, needed - line.stock);
    return { ...line, needed, missing, purchaseCost: missing * line.unitPrice };
  });
}

export function totalPurchaseCost(lines: ReturnType<typeof calculateCraft>) {
  return lines.reduce((total, line) => total + line.purchaseCost, 0);
}
