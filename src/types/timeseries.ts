export interface StockRecord {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface AdjustedStockRecord extends StockRecord {
    adjusted_close: number;
    dividend_amount: number;
}

export interface DailyAdjustedStockRecord extends AdjustedStockRecord {
    split_coefficient: number;
}
