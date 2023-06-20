import {useParams} from "react-router-dom";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CandleStickChart from "./stock_analysis/visualisation/CandleStickChart";
import {StockRecord} from "../types/timeseries";
import axios from "axios";
import OverviewComponent from "./stock_analysis/OverviewComponent";
import {StockOverview} from "../types/overview";
import {BalanceSheet, CashFlow, IncomeStatement} from "../types/financial";
import FinancialComponent from "./stock_analysis/FinancialComponent";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const {symbol} = useParams();
    const [value, setValue] = React.useState(0);
    const [stockRecords, setStockRecords] = React.useState<StockRecord[]>([]); // New state variable for stock records
    const [stockOverview, setStockOverview] = React.useState<StockOverview>({
        Symbol: "",
        AssetType: "",
        Name: "",
        Description: "",
        CIK: "",
        Exchange: "",
        Currency: "",
        Country: "",
        Sector: "",
        Industry: "",
        Address: "",
        FiscalYearEnd: "",
        LatestQuarter: "",
        MarketCapitalization: "",
        EBITDA: "",
        PERatio: "",
        PEGRatio: "",
        BookValue: "",
        DividendPerShare: "",
        DividendYield: "",
        EPS: "",
        RevenuePerShareTTM: "",
        ProfitMargin: "",
        OperatingMarginTTM: "",
        ReturnOnAssetsTTM: "",
        ReturnOnEquityTTM: "",
        RevenueTTM: "",
        GrossProfitTTM: "",
        DilutedEPSTTM: "",
        QuarterlyEarningsGrowthYOY: "",
        QuarterlyRevenueGrowthYOY: "",
        AnalystTargetPrice: "",
        TrailingPE: "",
        ForwardPE: "",
        PriceToSalesRatioTTM: "",
        PriceToBookRatio: "",
        EVToRevenue: "",
        EVToEBITDA: "",
        Beta: "",
        "52WeekHigh": "",
        "52WeekLow": "",
        "50DayMovingAverage": "",
        "200DayMovingAverage": "",
        SharesOutstanding: "",
        DividendDate: "",
        ExDividendDate: "",
    })
    const [incomeStatement, setIncomeStatement] = React.useState<IncomeStatement>({
        symbol: "",
        annualReports: [],
        quarterlyReports: []
    })
    const [balanceSheet, setBalanceSheet] = React.useState<BalanceSheet>({
        symbol: "",
        annualReports: [],
        quarterlyReports: []
    })
    const [cashFlow, setCashFlow] = React.useState<CashFlow>({
        symbol: "",
        annualReports: [],
        quarterlyReports: []
    })


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function createStockRecord(stockRecord: Partial<StockRecord>): StockRecord {
        return {
            timestamp: new Date(),
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            volume: 0,
            ...stockRecord,
        }
    }

    async function getStockData(function_name: string, data_key: string = "") {
        let response = await axios.get(`stock/data/${symbol}/${function_name}/`);

        if (data_key === "") return response.data;
        return response.data[data_key];
    }

    React.useEffect(() => {
        getStockData("weekly", "Weekly Time Series")
            .then(data => {

                setStockRecords(Object.keys(data).map((key) => createStockRecord({
                    timestamp: new Date(key),
                    open: parseFloat(data[key]["1. open"]),
                    high: parseFloat(data[key]["2. high"]),
                    low: parseFloat(data[key]["3. low"]),
                    close: parseFloat(data[key]["4. close"]),
                    volume: parseInt(data[key]["5. volume"]),
                })))

            })
            .catch(err => {
                console.log("Cannot get ts data!", err);
            });
    }, [symbol]);

    React.useEffect(() => {
        getStockData("overview").then(data => {
            setStockOverview(data)
        }).catch(err => {
            console.log("Cannot get overview data!", err)
        })
    }, [symbol])

    React.useEffect(() => {
        getStockData("income_statement").then(
            data => {
                setIncomeStatement(data)
            }
        ).catch(err => {
                console.log("Cannot get income_statement!", err)
            }
        );

        getStockData("balance_sheet").then(
            data => {
                setBalanceSheet(data)
            }
        ).catch(err => {
                console.log("Cannot get balance_sheet!", err)
            }
        );

        getStockData("cash_flow").then(
            data => {
                setCashFlow(data)
            }
        ).catch(err => {
                console.log("Cannot get cash_flow!", err)
            }
        );
    }, [symbol])

    return (
        <>
            <h1>{symbol}</h1>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label={`Tab Analysis for ${symbol}`}>
                        <Tab label="Overview" {...a11yProps(0)} />
                        <Tab label="Financial" {...a11yProps(1)} />
                        <Tab label="Statistic" {...a11yProps(2)} />
                        <Tab label="Forecast" {...a11yProps(3)} />
                        <Tab label="Chart" {...a11yProps(4)} />

                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <OverviewComponent stockOverview={stockOverview}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <FinancialComponent incomeStatement={incomeStatement} balanceSheet={balanceSheet} cashFlow={cashFlow}/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Item Four
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <CandleStickChart stockRecords={stockRecords}/>
                </TabPanel>
            </Box>
        </>

    );
}