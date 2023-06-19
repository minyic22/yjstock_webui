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
                    <Typography>{children}</Typography>
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

    React.useEffect(() => {
        async function getTimeSeries(function_name: string, data_key: string) {
            let response = await axios.get(`stock/time_series/${symbol}/${function_name}/`);
            let ts_data = response.data[data_key];
            return Object.keys(ts_data).map((key) => createStockRecord({
                timestamp: new Date(key),
                open: parseFloat(ts_data[key]["1. open"]),
                high: parseFloat(ts_data[key]["2. high"]),
                low: parseFloat(ts_data[key]["3. low"]),
                close: parseFloat(ts_data[key]["4. close"]),
                volume: parseInt(ts_data[key]["5. volume"]),
            }));
        }

        getTimeSeries("weekly", "Weekly Time Series")
            .then(data => {
                setStockRecords(data);  // use the data here
            })
            .catch(err => {
                console.log("Cannot get ts data!", err);
            });
    }, [symbol]);


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
                    <OverviewComponent/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
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