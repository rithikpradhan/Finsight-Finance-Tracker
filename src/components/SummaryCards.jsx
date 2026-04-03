import React from "react";
import { useApp } from "../context/AppContext";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function SummaryCard({ title, amount, icon: Icon, trend, color, bg, delay }) {
  const { state } = useApp();
  const dark = state.darkMode;

  return (
    <div
      className={`rounded-2xl p-5 shadow-lg relative overflow-hidden card-animate ${dark ? "bg-slate-800" : "bg-white"} cursor-pointer scale-95 hover:scale-100 transition-all`}
      style={{ animationDelay: `${delay}ms`, background: bg }}
    >
      {/* Decorative blob */}
      <div
        className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
        style={{ background: color }}
      />
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-semibold tracking-wide ${dark ? "text-slate-400" : "text-gray-800"}`}
        >
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: color + "22", color }}
        >
          <Icon size={18} />
        </div>
      </div>
      <div
        className={`text-2xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-gray-800"}`}
      >
        {fmt(amount)}
      </div>
      {trend && (
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color }}
        >
          <ArrowUpRight size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function SummaryCards() {
  const { balance, totalIncome, totalExpenses, state } = useApp();
  const dark = state.darkMode;

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      icon: Wallet,
      color: "#6366f1",
      bg: dark ? "#1e1b4b" : "#eef2ff",
      trend: "Net position",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      color: "#10b981",
      bg: dark ? "#022c22" : "#ecfdf5",
      trend: "All time earnings",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      color: "#ef4444",
      bg: dark ? "#2d0a0a" : "#fff1f2",
      trend: "All time spending",
    },
    {
      title: "Savings Rate",
      amount: totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0,
      icon: TrendingUp,
      color: "#f59e0b",
      bg: dark ? "#2d1a00" : "#fffbeb",
      trend: "of income saved",
      isSavings: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <SummaryCard key={c.title} {...c} delay={i * 80} />
      ))}
    </div>
  );
}
