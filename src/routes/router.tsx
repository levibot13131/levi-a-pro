
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
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
import TradingViewIntegration from "../pages/TradingViewIntegration";
import CryptoSentiment from "../pages/CryptoSentiment";
import FAQ from "../pages/FAQ";
import DeploymentGuide from "../pages/DeploymentGuide";
import RequireAuth from "@/components/auth/RequireAuth";
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
        element: <Dashboard />,
      },
      {
        path: "dashboard",
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
        path: "binance-integration",
        element: <BinanceIntegration />,
      },
      {
        path: "twitter-integration",
        element: <TwitterIntegration />,
      },
      {
        path: "tradingview-integration",
        element: <TradingViewIntegration />,
      },
      {
        path: "crypto-sentiment",
        element: <CryptoSentiment />,
      },
      {
        path: "sentiment",
        element: <CryptoSentiment />,
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
        path: "deployment-guide",
        element: <DeploymentGuide />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "links",
        element: <LinkPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "information-sources",
        element: <InformationSources />,
      },
      {
        path: "market-news",
        element: <MarketNews />,
      },
      {
        path: "market-data",
        element: <MarketNews />,
      },
      {
        path: "fundamental-data",
        element: <FundamentalData />,
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
