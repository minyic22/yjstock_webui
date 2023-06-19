import * as React from 'react';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {Grid} from '@mui/material';
import {Link} from "react-router-dom";

interface Stock {
    symbol: string;
    name: string;
    type: string;
    region: string;
    marketOpen: string;
    marketClose: string;
    timezone: string;
    currency: string;
    price: number;
}

interface Ticker {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
}

interface GlobalQuote {
    "01. symbol": string,
    "02. open": string,
    "03. high": string,
    "04. low": string,
    "05. price": string,
    "06. volume": string,
    "07. latest trading day": string,
    "08. previous close": string,
    "09. change": string,
    "10. change percent": string,
}

interface Option extends Ticker {
    label: string;
}

interface SearchAutocompleteBoxProps {
    stocks: Stock[];
    setStocks: (stocks: Stock[]) => void;
}

function createStock(stock: Partial<Stock>): Stock {
    return {
        symbol: '',
        name: '',
        type: '',
        region: '',
        marketOpen: '',
        marketClose: '',
        timezone: '',
        currency: '',
        ...stock,  // This line overwrites the default values with the provided values
        price: stock.price === undefined ? -1 : stock.price,  // If stock.price is undefined, use -1, else use stock.price
    };
}

function SearchAutocompleteBox(props: SearchAutocompleteBoxProps) {
    const {stocks, setStocks} = props;
    const [options, setOptions] = React.useState<Option[]>([])

    const handleAddClick = (option: Option) => {
        if (!stocks.some(stock => stock.symbol === option.label)) {
            let newStock: Stock = createStock(
                {
                    symbol: option.label,
                    name: option["2. name"],
                    type: option["3. type"],
                    region: option["4. region"],
                    marketOpen: option["5. marketOpen"],
                    marketClose: option["6. marketClose"],
                    timezone: option["7. timezone"],
                    currency: option["8. currency"],
                    price: -1,
                }
            )
            setStocks([...stocks, newStock])
        }
    }

    const handleInputChange = async (_event: React.ChangeEvent<{}>, value: string) => {
        try {
            if (value !== null && "" !== value) {
                const response = await axios.get(`stock/search/${value}/?datatype=json`);
                let newOptions: Option[] = response.data.bestMatches.map((match: Ticker) => ({
                    ...match, label: match["1. symbol"],
                }));
                setOptions(newOptions);
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            onInputChange={handleInputChange}
            onChange={(event: any, newValue: Option | null) => {
                console.log(event, newValue)
            }}
            isOptionEqualToValue={(option, value) => option['1. symbol'] === value['1. symbol']}

            sx={{width: 500}}
            // disableCloseOnSelect
            renderInput={
                (params) => <TextField {...params} label={"Search Symbol"}/>
            }
            renderOption={(props, option, _state) => (
                <Grid container component="li" {...props}>
                    <Grid item xs={9}>
                        <Typography variant="body1">{option.label}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="text" onClick={(_event: React.MouseEvent<{}>,) => handleAddClick(option)}
                                startIcon={<AddIcon/>}>
                            watchlist
                        </Button>
                    </Grid>
                </Grid>
            )}
        />
    );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Stock;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'symbol',
        numeric: false,
        disablePadding: true,
        label: 'Symbol',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'region',
        numeric: false,
        disablePadding: false,
        label: 'Region',
    },
    {
        id: 'marketOpen',
        numeric: false,
        disablePadding: false,
        label: 'MarketOpen',
    },
    {
        id: 'marketClose',
        numeric: false,
        disablePadding: false,
        label: 'MarketClose',
    },
    {
        id: 'timezone',
        numeric: false,
        disablePadding: false,
        label: 'Timezone',
    },
    {
        id: 'currency',
        numeric: false,
        disablePadding: false,
        label: 'Currency',
    }, {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Price',
    },


];

interface EnhancedTableHeadProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Stock) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Stock) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const {numSelected} = props;

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Market
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

interface EnhancedTableProps {
    stocks: Stock[];
    setStocks: (stocks: Stock[]) => void;
}

function EnhancedTable(props: EnhancedTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Stock>('symbol');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const {stocks, setStocks} = props;

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof Stock,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = stocks.map((stock) => stock.symbol);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event: React.MouseEvent<unknown>, symbol: string) => {
        const selectedIndex = selected.indexOf(symbol);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, symbol);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (symbol: string) => selected.indexOf(symbol) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stocks.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(stocks, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [stocks, order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar numSelected={selected.length}/>
                <TableContainer>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={stocks.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.symbol as string);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.symbol}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                onClick={(event) => handleClick(event, row.symbol as string)}
                                                sx={{cursor: 'pointer'}}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Link to={`/stock/${row.symbol}/`}>{row.symbol}</Link>
                                        </TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{row.type}</TableCell>
                                        <TableCell align="left">{row.region}</TableCell>
                                        <TableCell align="left">{row.marketOpen}</TableCell>
                                        <TableCell align="left">{row.marketClose}</TableCell>
                                        <TableCell align="left">{row.timezone}</TableCell>
                                        <TableCell align="left">{row.currency}</TableCell>
                                        <TableCell align="left">{row.price}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={stocks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Dense padding"
            />
        </Box>
    );
}

export default function WatchlistComponent() {
    const [stocks, setStocks] = React.useState<Stock[]>([{
        symbol: "TSCO.LON",
        name: "Tesco PLC",
        type: "Equity",
        region: "United Kingdom",
        marketOpen: "08:00",
        marketClose: "16:30",
        timezone: "UTC+01",
        currency: "GBX",
        price: -1,
    }]);

    const getUpdatedPrice = async () => {
        const updatedStocks = await Promise.all(stocks.map(async stock => {
            const response = await axios.get(`stock/data/${stock.symbol}/quote_endpoint/`);
            let globalQuote: GlobalQuote = response.data["Global Quote"];
            return {...stock, price: parseFloat(globalQuote["05. price"])};
        }));
        return updatedStocks;
    };

    React.useEffect(() => {
        getUpdatedPrice().then(updatedStocks => {
            if (updatedStocks.some((stock, index) => stock.price !== stocks[index].price)) {
                // Check if prices actually changed.
                setStocks(updatedStocks);
            }
        }).catch((error) => {
            console.error('Error updating stock prices:', error);
        });
    }, [stocks]);

    return (
        <>
            <SearchAutocompleteBox stocks={stocks} setStocks={setStocks}/>
            <EnhancedTable stocks={stocks} setStocks={setStocks}/>
        </>
    );
}