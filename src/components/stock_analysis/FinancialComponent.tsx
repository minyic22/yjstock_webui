import {IncomeStatement, BalanceSheet, CashFlow} from "../../types/financial";

interface FinancialComponentProps {
    incomeStatement: IncomeStatement;
    balanceSheet: BalanceSheet;
    cashFlow: CashFlow;
}

export default function FinancialComponent(props: FinancialComponentProps) {
    const {incomeStatement, balanceSheet, cashFlow} = props;
    return (
        <>
            <pre>{JSON.stringify(cashFlow, null, 2)}</pre>
        </>
    )
}