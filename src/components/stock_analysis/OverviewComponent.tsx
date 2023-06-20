import {StockOverview} from "../../types/overview";
interface OverviewComponentProps {
    stockOverview: StockOverview;
}

export default function OverviewComponent (overviewComponentProps: OverviewComponentProps) {
    const {stockOverview} = overviewComponentProps;
    return (
        <div>
            <pre>{JSON.stringify(stockOverview, null, 2)}</pre>
        </div>
    )
}