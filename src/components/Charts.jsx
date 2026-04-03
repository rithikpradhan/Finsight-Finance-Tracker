import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import { monthlyTrend } from "../data/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export function BalanceTrendChart() {
  const { state } = useApp();
  const dark = state.darkMode;

  const data = {
    labels: monthlyTrend.map((m) => m.month),
    datasets: [
      {
        label: "Income",
        data: monthlyTrend.map((m) => m.income),
        backgroundColor: "rgba(99,102,241,0.15)",
        borderColor: "#6366f1",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointRadius: 4,
      },
      {
        label: "Expenses",
        data: monthlyTrend.map((m) => m.expenses),
        backgroundColor: "rgba(239,68,68,0.1)",
        borderColor: "#ef4444",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ef4444",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: dark ? "#e2e8f0" : "#374151",
          font: { family: "Outfit", size: 12 },
          boxWidth: 12,
          borderRadius: 3,
        },
      },
      tooltip: {
        backgroundColor: dark ? "#1e293b" : "#fff",
        titleColor: dark ? "#e2e8f0" : "#111827",
        bodyColor: dark ? "#94a3b8" : "#6b7280",
        borderColor: dark ? "#334155" : "#e5e7eb",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: dark ? "#1e293b" : "#f3f4f6" },
        ticks: {
          color: dark ? "#94a3b8" : "#6b7280",
          font: { family: "Outfit" },
        },
      },
      y: {
        grid: { color: dark ? "#1e293b" : "#f3f4f6" },
        ticks: {
          color: dark ? "#94a3b8" : "#6b7280",
          font: { family: "Outfit" },
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-lg ${dark ? "bg-slate-800" : "bg-white"} card-animate`}
      style={{ animationDelay: "200ms" }}
    >
      <h3
        className={`font-bold text-base mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}
      >
        Income vs Expenses Trend
      </h3>
      <div style={{ height: 220 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function SpendingDonut() {
  const { state } = useApp();
  const dark = state.darkMode;

  const expenseByCategory = useMemo(() => {
    const map = {};
    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [state.transactions]);

  const labels = Object.keys(expenseByCategory);
  const values = Object.values(expenseByCategory);
  const colors = labels.map((l) => CATEGORIES[l]?.color || "#94a3b8");

  const data = {
    labels,
    datasets: [
      { data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: dark ? "#e2e8f0" : "#374151",
          font: { family: "Outfit", size: 11 },
          boxWidth: 10,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: dark ? "#1e293b" : "#fff",
        titleColor: dark ? "#e2e8f0" : "#111827",
        bodyColor: dark ? "#94a3b8" : "#6b7280",
        borderColor: dark ? "#334155" : "#e5e7eb",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-lg ${dark ? "bg-slate-800" : "bg-white"} card-animate`}
      style={{ animationDelay: "280ms" }}
    >
      <h3
        className={`font-bold text-base mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}
      >
        Spending Breakdown
      </h3>
      <div style={{ height: 220 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export function MonthlyBarChart() {
  const { state } = useApp();
  const dark = state.darkMode;

  const data = {
    labels: monthlyTrend.map((m) => m.month),
    datasets: [
      {
        label: "Income",
        data: monthlyTrend.map((m) => m.income),
        backgroundColor: "#6366f1cc",
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: monthlyTrend.map((m) => m.expenses),
        backgroundColor: "#ef4444aa",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: dark ? "#e2e8f0" : "#374151",
          font: { family: "Outfit", size: 12 },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: dark ? "#1e293b" : "#fff",
        titleColor: dark ? "#e2e8f0" : "#111827",
        bodyColor: dark ? "#94a3b8" : "#6b7280",
        borderColor: dark ? "#334155" : "#e5e7eb",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: dark ? "#94a3b8" : "#6b7280",
          font: { family: "Outfit" },
        },
      },
      y: {
        grid: { color: dark ? "#1e293b" : "#f3f4f6" },
        ticks: {
          color: dark ? "#94a3b8" : "#6b7280",
          font: { family: "Outfit" },
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-lg ${dark ? "bg-slate-800" : "bg-white"} col-span-1 card-animate`}
      style={{ animationDelay: "320ms" }}
    >
      <h3
        className={`font-bold text-base mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}
      >
        Monthly Comparison
      </h3>
      <div style={{ height: 220 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
