import {Grid, Paper, Button, ButtonGroup} from '@mui/material';
import {Outlet, useNavigate} from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './App.css'
import {useState} from "react";

function App() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleClick = (href: string) => {
        navigate(href);
    };

    function a11yProps(index: number, href: string) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
            onClick: (event: React.MouseEvent<HTMLElement>) => handleClick(href)
        };
    }

    return (
        <div className="App">
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <h3>Left Panel</h3>
                        <Tabs value={value} onChange={handleChange} aria-label="menu tab" orientation="vertical">
                            <Tab label="Home" {...a11yProps(0, "/home")} />
                            <Tab label="Watchlist" {...a11yProps(1, "/watchlist")} />
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper>
                        <h3>Right Panel</h3>
                        <Outlet/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default App
