import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RequireAuth from "@/components/auth/RequireAuth";
import Dashboard from "../pages/Dashboard";
import Assets from "../pages/Assets";
import Alerts from "../pages/Alerts";
import Signals from "../pages/Signals";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import TradingViewIntegration from "../pages/TradingViewIntegration";
import CryptoSentiment from "../pages/CryptoSentiment";
import TwitterIntegration from "../pages/TwitterIntegration";
import BinanceIntegration from "../pages/BinanceIntegration";
import Backtesting from "../pages/Backtesting";
import TechnicalAnalysis from "../pages/TechnicalAnalysis";
import Portfolio from "../pages/Portfolio";
import ProxySettings from "../pages/ProxySettings";
import TradingSignals from "../pages/TradingSignals";
import DataConnections from "../pages/DataConnections";
import AssetTracker from "../pages/AssetTracker";
import FAQ from "../pages/FAQ";
import DeploymentGuide from "../pages/DeploymentGuide";
import ProxyGuide from "../pages/ProxyGuide";
import Home from "../pages/Home";
import LinkPage from "../pages/LinkPage";
import Profile from "../pages/Profile";
import InformationSources from "../pages/InformationSources";
import MarketNews from "../pages/MarketNews";
import FundamentalData from "../pages/FundamentalData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RequireAuth><Dashboard /></RequireAuth>,
      },
      {
        path: "dashboard",
        element: <RequireAuth><Dashboard /></RequireAuth>,
      },
      {
        path: "assets",
        element: <RequireAuth><Assets /></RequireAuth>,
      },
      {
        path: "alerts",
        element: <RequireAuth><Alerts /></RequireAuth>,
      },
      {
        path: "signals",
        element: <RequireAuth><Signals /></RequireAuth>,
      },
      {
        path: "settings",
        element: <RequireAuth><Settings /></RequireAuth>,
      },
      {
        path: "tradingview",
        element: <RequireAuth><TradingViewIntegration /></RequireAuth>,
      },
      {
        path: "sentiment",
        element: <RequireAuth><CryptoSentiment /></RequireAuth>,
      },
      {
        path: "twitter",
        element: <RequireAuth><TwitterIntegration /></RequireAuth>,
      },
      {
        path: "binance",
        element: <RequireAuth><BinanceIntegration /></RequireAuth>,
      },
      {
        path: "backtesting",
        element: <RequireAuth><Backtesting /></RequireAuth>,
      },
      {
        path: "technical-analysis",
        element: <RequireAuth><TechnicalAnalysis /></RequireAuth>,
      },
      {
        path: "portfolio",
        element: <RequireAuth><Portfolio /></RequireAuth>,
      },
      {
        path: "asset-tracker",
        element: <RequireAuth><AssetTracker /></RequireAuth>,
      },
      {
        path: "trading-signals",
        element: <RequireAuth><TradingSignals /></RequireAuth>,
      },
      {
        path: "data-connections",
        element: <RequireAuth><DataConnections /></RequireAuth>,
      },
      {
        path: "proxy-settings",
        element: <RequireAuth><ProxySettings /></RequireAuth>,
      },
      {
        path: "deployment-guide",
        element: <RequireAuth><DeploymentGuide /></RequireAuth>,
      },
      {
        path: "faq",
        element: <RequireAuth><FAQ /></RequireAuth>,
      },
      {
        path: "links",
        element: <RequireAuth><LinkPage /></RequireAuth>,
      },
      {
        path: "profile",
        element: <RequireAuth><Profile /></RequireAuth>,
      },
      {
        path: "information-sources",
        element: <RequireAuth><InformationSources /></RequireAuth>,
      },
      {
        path: "market-news",
        element: <RequireAuth><MarketNews /></RequireAuth>,
      },
      {
        path: "market-data",
        element: <RequireAuth><MarketNews /></RequireAuth>,
      },
      {
        path: "fundamental-data",
        element: <RequireAuth><FundamentalData /></RequireAuth>,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "*",
        element: <NotFound />,
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
  {
    path: "/proxy-guide",
    element: <ProxyGuide />,
  },
]);

export default router;
