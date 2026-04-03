import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  Download,
} from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const MONTHS = ["All", "Jan 2025", "Feb 2025", "Mar 2025"];

function FilterBar({ filters, onChange, dark }) {
  return (
    <div
      className={`flex flex-wrap gap-3 p-4 rounded-xl mb-4 ${dark ? "bg-slate-700/50" : "bg-gray-50"}`}
    >
      {/* Search */}
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-48 ${dark ? "bg-slate-800" : "bg-white"} border ${dark ? "border-slate-600" : "border-gray-200"}`}
      >
        <Search size={15} className="text-gray-400" />
        <input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search transactions..."
          className={`bg-transparent outline-none text-sm flex-1 ${dark ? "text-slate-200 placeholder:text-slate-500" : "text-gray-700"}`}
        />
      </div>
      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className={`rounded-lg px-3 py-2 text-sm outline-none border ${dark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-gray-200 text-gray-700"}`}
      >
        <option value="All">All Categories</option>
        {Object.keys(CATEGORIES).map((c) => (
          <option key={c} value={c}>
            {CATEGORIES[c].icon} {c}
          </option>
        ))}
      </select>
      {/* Type */}
      <select
        value={filters.type}
        onChange={(e) => onChange({ type: e.target.value })}
        className={`rounded-lg px-3 py-2 text-sm outline-none border ${dark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-gray-200 text-gray-700"}`}
      >
        <option value="All">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      {/* Month */}
      <select
        value={filters.month}
        onChange={(e) => onChange({ month: e.target.value })}
        className={`rounded-lg px-3 py-2 text-sm outline-none border ${dark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-gray-200 text-gray-700"}`}
      >
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m === "All" ? "All Months" : m}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Transactions() {
  const { state, dispatch, filteredTransactions } = useApp();
  const dark = state.darkMode;
  const isAdmin = state.role === "admin";

  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [editTx, setEditTx] = useState(null);

  const sorted = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortField === "date")
        return sortDir === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      if (sortField === "amount")
        return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
      return 0;
    });
  }, [filteredTransactions, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const exportCSV = () => {
    const rows = [["Date", "Description", "Category", "Type", "Amount"]];
    sorted.forEach((t) =>
      rows.push([t.date, t.description, t.category, t.type, t.amount]),
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div
      className={`rounded-2xl shadow-lg ${dark ? "bg-slate-800" : "bg-white"} p-5 card-animate`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-bold text-base ${dark ? "text-slate-100" : "text-gray-800"}`}
        >
          Transactions
          <span
            className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${dark ? "bg-slate-700 text-slate-400" : "bg-gray-100 text-gray-500"}`}
          >
            {sorted.length}
          </span>
        </h3>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      <FilterBar
        filters={state.filters}
        onChange={(f) => dispatch({ type: "SET_FILTER", payload: f })}
        dark={dark}
      />

      {/* Sort bar */}
      <div
        className={`flex gap-2 mb-2 text-xs font-semibold px-3 ${dark ? "text-slate-500" : "text-gray-400"}`}
      >
        <button
          onClick={() => toggleSort("date")}
          className="flex items-center gap-1 hover:text-indigo-500"
        >
          Date {sortField === "date" ? (sortDir === "desc" ? "↓" : "↑") : ""}
        </button>
        <span className="ml-auto" />
        <button
          onClick={() => toggleSort("amount")}
          className="flex items-center gap-1 hover:text-indigo-500"
        >
          Amount{" "}
          {sortField === "amount" ? (sortDir === "desc" ? "↓" : "↑") : ""}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div
          className={`text-center py-16 ${dark ? "text-slate-500" : "text-gray-400"}`}
        >
          <div className="text-4xl mb-2">🔍</div>
          <div className="font-medium">No transactions found</div>
          <div className="text-sm mt-1">Try changing your filters</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 custom-scroll">
          {sorted.map((t) => {
            const cat = CATEGORIES[t.category] || {};
            return (
              <div
                key={t.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] ${dark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: cat.color + "20" }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-sm truncate ${dark ? "text-slate-200" : "text-gray-800"}`}
                  >
                    {t.description}
                  </div>
                  <div
                    className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}
                  >
                    {t.category} ·{" "}
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                <div
                  className={`font-bold text-sm ${t.type === "income" ? "text-emerald-500" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {fmt(t.amount)}
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTx(t)}
                      className={`p-1.5 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors ${dark ? "text-slate-400" : "text-gray-400"}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: "DELETE_TRANSACTION", payload: t.id })
                      }
                      className={`p-1.5 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors ${dark ? "text-slate-400" : "text-gray-400"}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editTx && (
        <TransactionModal
          tx={editTx}
          dark={dark}
          onClose={() => setEditTx(null)}
          onSave={(updated) => {
            dispatch({ type: "EDIT_TRANSACTION", payload: updated });
            setEditTx(null);
          }}
        />
      )}
    </div>
  );
}

function TransactionModal({ tx, dark, onClose, onSave }) {
  const [form, setForm] = useState({ ...tx });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${dark ? "bg-slate-800" : "bg-white"}`}
      >
        <h3
          className={`font-bold text-lg mb-4 ${dark ? "text-white" : "text-gray-800"}`}
        >
          Edit Transaction
        </h3>
        <div className="space-y-3">
          {[
            { label: "Description", key: "description", type: "text" },
            { label: "Amount (₹)", key: "amount", type: "number" },
            { label: "Date", key: "date", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label
                className={`text-xs font-semibold block mb-1 ${dark ? "text-slate-400" : "text-gray-500"}`}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) =>
                  update(
                    key,
                    type === "number" ? +e.target.value : e.target.value,
                  )
                }
                className={`w-full rounded-lg px-3 py-2 text-sm border outline-none ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`}
              />
            </div>
          ))}
          <div>
            <label
              className={`text-xs font-semibold block mb-1 ${dark ? "text-slate-400" : "text-gray-500"}`}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm border outline-none ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`}
            >
              {Object.keys(CATEGORIES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`text-xs font-semibold block mb-1 ${dark ? "text-slate-400" : "text-gray-500"}`}
            >
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm border outline-none ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${dark ? "border-slate-600 text-slate-300" : "border-gray-200 text-gray-600"}`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
