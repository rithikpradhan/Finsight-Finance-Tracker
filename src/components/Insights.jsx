import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, monthlyTrend } from "../data/mockData";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function InsightCard({ icon, title, value, sub, color, dark, delay }) {
  return (
    <div
      className={`rounded-2xl p-4 flex items-start gap-3 shadow-lg  card-animate ${dark ? "bg-slate-800" : "bg-white"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <div
          className={`text-xs font-semibold mb-0.5 ${dark ? "text-slate-400" : "text-gray-500"}`}
        >
          {title}
        </div>
        <div className={`font-bold text-base`} style={{ color }}>
          {value}
        </div>
        {sub && (
          <div
            className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-gray-400"}`}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const dark = state.darkMode;

  const insights = useMemo(() => {
    const expenses = state.transactions.filter((t) => t.type === "expense");
    const byCategory = {};
    expenses.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const totalInc = state.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const savingsRate =
      totalInc > 0 ? (((totalInc - totalExp) / totalInc) * 100).toFixed(1) : 0;

    const prev = monthlyTrend[monthlyTrend.length - 2];
    const curr = monthlyTrend[monthlyTrend.length - 1];
    const expDiff = curr.expenses - prev.expenses;
    const expPct = ((expDiff / prev.expenses) * 100).toFixed(1);

    const avgExpense =
      expenses.length > 0 ? (totalExp / expenses.length).toFixed(0) : 0;

    return [
      {
        icon: CATEGORIES[topCat?.[0]]?.icon || "📊",
        title: "Top Spending Category",
        value: topCat?.[0] || "—",
        sub: topCat ? `${fmt(topCat[1])} total spent` : "No data",
        color: CATEGORIES[topCat?.[0]]?.color || "#6366f1",
      },
      {
        icon: "💰",
        title: "Savings Rate",
        value: `${savingsRate}%`,
        sub: "of your total income saved",
        color: +savingsRate >= 20 ? "#10b981" : "#f59e0b",
      },
      {
        icon: expDiff > 0 ? "📈" : "📉",
        title: "vs Last Month (Expenses)",
        value: `${expDiff > 0 ? "+" : ""}${expPct}%`,
        sub: `${fmt(Math.abs(expDiff))} ${expDiff > 0 ? "more" : "less"} than ${prev.month}`,
        color: expDiff > 0 ? "#ef4444" : "#10b981",
      },
      {
        icon: "🧾",
        title: "Avg Transaction Size",
        value: fmt(+avgExpense),
        sub: `across ${expenses.length} expense transactions`,
        color: "#6366f1",
      },
      {
        icon: "🎯",
        title: "Savings Goal",
        value: +savingsRate >= 20 ? "On Track 🎉" : "Below Target",
        sub: "Target: 20% savings rate",
        color: +savingsRate >= 20 ? "#10b981" : "#ef4444",
      },
      {
        icon: "🏆",
        title: "Best Saving Month",
        value: (() => {
          const best = monthlyTrend.reduce((b, m) =>
            m.income - m.expenses > b.income - b.expenses ? m : b,
          );
          return best.month;
        })(),
        sub: `Highest net savings of all months`,
        color: "#f59e0b",
      },
    ];
  }, [state.transactions]);

  return (
    <div>
      <h3
        className={`font-bold text-md mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}
      >
        Smart Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((ins, i) => (
          <InsightCard key={ins.title} {...ins} dark={dark} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}
