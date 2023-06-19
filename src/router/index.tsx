import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import WatchlistComponent from "../components/WatchlistComponent";
import StockAnalysisComponent from "../components/StockAnalysisComponent";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "home/",
                element: <h1>Home Page</h1> ,
            },
            {
                path: "watchlist",
                element: <WatchlistComponent/>,
            },
        ],
        errorElement:<h1>Error has occurred</h1>,
    },
    {
        path: "/stock/:symbol/",
        element: <StockAnalysisComponent/>,
        children: [
        ],
        errorElement:<h1>Error has occurred</h1>,
    },
]);

export default router;