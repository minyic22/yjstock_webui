import {Grid, Paper, Button, ButtonGroup} from '@mui/material';
import {Outlet, useNavigate} from "react-router-dom";
import './App.css'

function App() {
    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget as HTMLElement;
        const menuItem = target.getAttribute("data-target");
        navigate(`/${menuItem}`);
    };
    const menus = [
        <Button key="Home" onClick={handleClick} data-target="Home" style={{ height: 50, justifyContent: 'flex-start' }}>Home</Button>,
        <Button key="watchlist" onClick={handleClick} data-target="watchlist" style={{ height: 50, justifyContent: 'flex-start' }}>WatchList</Button>,
    ];

    return (
        <div className="App">
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h3>Left Panel</h3>
                        <ButtonGroup
                            orientation="vertical"
                            aria-label="vertical contained button group"
                            variant="text"
                        >
                            {menus}
                        </ButtonGroup>
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
