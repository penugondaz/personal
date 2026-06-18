export interface StockPurchase {
  id: string;
  quantity: number;
  pricePerShare: number;
}

export interface StockAverageResult {
  totalShares: number;
  totalInvested: number;
  averagePrice: number;
  purchases: { quantity: number; price: number; cost: number }[];
}

export function calculateStockAverage(purchases: StockPurchase[]): StockAverageResult {
  const valid = purchases.filter((p) => p.quantity > 0 && p.pricePerShare > 0);
  let totalShares = 0;
  let totalInvested = 0;
  const rows = valid.map((p) => {
    const cost = p.quantity * p.pricePerShare;
    totalShares += p.quantity;
    totalInvested += cost;
    return { quantity: p.quantity, price: p.pricePerShare, cost: Math.round(cost * 100) / 100 };
  });
  return {
    totalShares,
    totalInvested: Math.round(totalInvested * 100) / 100,
    averagePrice: totalShares > 0 ? Math.round((totalInvested / totalShares) * 100) / 100 : 0,
    purchases: rows,
  };
}
