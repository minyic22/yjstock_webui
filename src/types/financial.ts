export interface IncomeStatementRecords {
    fiscalDateEnding: string;
    reportedCurrency: string;
    grossProfit: string;
    totalRevenue: string;
    costOfRevenue: string;
    costofGoodsAndServicesSold: string;
    operatingIncome: string;
    sellingGeneralAndAdministrative: string;
    researchAndDevelopment: string;
    operatingExpenses: string;
    investmentIncomeNet: string;
    netInterestIncome: string;
    interestIncome: string;
    interestExpense: string;
    nonInterestIncome: string;
    otherNonOperatingIncome: string;
    depreciation: string;
    depreciationAndAmortization: string;
    incomeBeforeTax: string;
    incomeTaxExpense: string;
    interestAndDebtExpense: string;
    netIncomeFromContinuingOperations: string;
    comprehensiveIncomeNetOfTax: string;
    ebit: string;
    ebitda: string;
    netIncome: string;
}

export interface IncomeStatement {
    symbol: string,
    annualReports: IncomeStatementRecords[],
    quarterlyReports: IncomeStatementRecords[],
}

export interface BalanceSheetRecord {
    fiscalDateEnding: string;
    reportedCurrency: string;
    totalAssets: string;
    totalCurrentAssets: string;
    cashAndCashEquivalentsAtCarryingValue: string;
    cashAndShortTermInvestments: string;
    inventory: string;
    currentNetReceivables: string;
    totalNonCurrentAssets: string;
    propertyPlantEquipment: string;
    accumulatedDepreciationAmortizationPPE: string;
    intangibleAssets: string;
    intangibleAssetsExcludingGoodwill: string;
    goodwill: string;
    investments: string;
    longTermInvestments: string;
    shortTermInvestments: string;
    otherCurrentAssets: string;
    otherNonCurrentAssets: string;
    totalLiabilities: string;
    totalCurrentLiabilities: string;
    currentAccountsPayable: string;
    deferredRevenue: string;
    currentDebt: string;
    shortTermDebt: string;
    totalNonCurrentLiabilities: string;
    capitalLeaseObligations: string;
    longTermDebt: string;
    currentLongTermDebt: string;
    longTermDebtNoncurrent: string;
    shortLongTermDebtTotal: string;
    otherCurrentLiabilities: string;
    otherNonCurrentLiabilities: string;
    totalShareholderEquity: string;
    treasuryStock: string;
    retainedEarnings: string;
    commonStock: string;
    commonStockSharesOutstanding: string;
}

export interface BalanceSheet {
    symbol: string,
    annualReports: BalanceSheetRecord[],
    quarterlyReports: BalanceSheetRecord[],
}

export interface CashFlowRecord {
    fiscalDateEnding:                                          string;
    reportedCurrency:                                          string;
    operatingCashflow:                                         string;
    paymentsForOperatingActivities:                            string;
    proceedsFromOperatingActivities:                           string;
    changeInOperatingLiabilities:                              string;
    changeInOperatingAssets:                                   string;
    depreciationDepletionAndAmortization:                      string;
    capitalExpenditures:                                       string;
    changeInReceivables:                                       string;
    changeInInventory:                                         string;
    profitLoss:                                                string;
    cashflowFromInvestment:                                    string;
    cashflowFromFinancing:                                     string;
    proceedsFromRepaymentsOfShortTermDebt:                     string;
    paymentsForRepurchaseOfCommonStock:                        string;
    paymentsForRepurchaseOfEquity:                             string;
    paymentsForRepurchaseOfPreferredStock:                     string;
    dividendPayout:                                            string;
    dividendPayoutCommonStock:                                 string;
    dividendPayoutPreferredStock:                              string;
    proceedsFromIssuanceOfCommonStock:                         string;
    proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: string;
    proceedsFromIssuanceOfPreferredStock:                      string;
    proceedsFromRepurchaseOfEquity:                            string;
    proceedsFromSaleOfTreasuryStock:                           string;
    changeInCashAndCashEquivalents:                            string;
    changeInExchangeRate:                                      string;
    netIncome:                                                 string;
}

export interface CashFlow {
    symbol: string,
    annualReports: CashFlowRecord[],
    quarterlyReports: CashFlowRecord[],
}