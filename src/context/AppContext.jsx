import React, { createContext, useContext, useReducer, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const AppContext = createContext();

const initialState = {
  transactions:
    JSON.parse(localStorage.getItem("fin_transactions")) || mockTransactions,
  role: localStorage.getItem("fin_role") || "viewer",
  darkMode: localStorage.getItem("fin_dark") === "true",
  filters: { search: "", category: "All", type: "All", month: "All" },
  activeTab: "dashboard",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem(
      "fin_transactions",
      JSON.stringify(state.transactions),
    );
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem("fin_role", state.role);
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem("fin_dark", state.darkMode);
  }, [state.darkMode]);

  const filteredTransactions = state.transactions.filter((t) => {
    const { search, category, type, month } = state.filters;
    const matchSearch =
      !search ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || t.category === category;
    const matchType = type === "All" || t.type === type;
    const matchMonth =
      month === "All" ||
      new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      }) === month;
    return matchSearch && matchCat && matchType && matchMonth;
  });

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        filteredTransactions,
        totalIncome,
        totalExpenses,
        balance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
