import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import {
  BalanceTrendChart,
  SpendingDonut,
  MonthlyBarChart,
} from "./components/Charts";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";

function Dashboard() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBarChart />
        <SpendingDonut />
      </div>
    </div>
  );
}

const PAGE_META = {
  dashboard: { title: "Dashboard", sub: "Your financial overview at a glance" },
  transactions: {
    title: "Transactions",
    sub: "Browse, filter and manage your money flow",
  },
  insights: { title: "Insights", sub: "Deep analysis of your spending habits" },
};

function PageHeader() {
  const { state } = useApp();
  const dark = state.darkMode;
  const { title, sub } = PAGE_META[state.activeTab] ?? PAGE_META.dashboard;

  return (
    <div className="mb-6">
      <h1
        className={`text-2xl tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h1>
      <p
        className={`text-sm mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}
      >
        {sub}
      </p>
    </div>
  );
}

function AppContent() {
  const { state } = useApp();
  const dark = state.darkMode;

  return (
    <div
      className={`
        flex flex-col lg:flex-row
        min-h-screen
        transition-colors duration-300
        ${dark ? "bg-slate-900" : "bg-gray-50"}
      `}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main
          className={`
            flex-1 overflow-y-auto custom-scroll
            px-4 py-5
            sm:px-6 sm:py-6
            ${dark ? "bg-slate-900" : "bg-gray-50"}
          `}
        >
          <div className="max-w-8xl mx-auto">
            <PageHeader />

            {state.activeTab === "dashboard" && <Dashboard />}

            {state.activeTab === "transactions" && (
              <div className="space-y-6">
                <BalanceTrendChart />
                <Transactions />
              </div>
            )}

            {state.activeTab === "insights" && <Insights />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
