
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Backtesting from "../pages/Backtesting";
import TechnicalAnalysis from "../pages/TechnicalAnalysis";
import Portfolio from "../pages/Portfolio";
import Settings from "../pages/Settings";
import ProxySettings from "../pages/ProxySettings";
import TradingSignals from "../pages/TradingSignals";
import DataConnections from "../pages/DataConnections";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AssetTracker from "../pages/AssetTracker";
import BinanceIntegration from "../pages/BinanceIntegration";
import TwitterIntegration from "../pages/TwitterIntegration";
import FAQ from "../pages/FAQ";
import RequireAuth from "@/components/auth/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "backtesting",
        element: <Backtesting />,
      },
      {
        path: "technical-analysis",
        element: <TechnicalAnalysis />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "asset-tracker",
        element: <AssetTracker />,
      },
      {
        path: "trading-signals",
        element: <TradingSignals />,
      },
      {
        path: "data-connections",
        element: <DataConnections />,
      },
      {
        path: "binance",
        element: <BinanceIntegration />,
      },
      {
        path: "twitter",
        element: <TwitterIntegration />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "proxy-settings",
        element: <ProxySettings />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
