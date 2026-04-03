import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BarChart3,
  List,
  Lightbulb,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    Icon: BarChart3,
    desc: "Overview & charts",
  },
  {
    id: "transactions",
    label: "Transactions",
    Icon: List,
    desc: "Browse & filter",
  },
  {
    id: "insights",
    label: "Insights",
    Icon: Lightbulb,
    desc: "Smart analysis",
  },
];

function NavList({ activeTab, dark, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3 flex-1">
      <p
        className={`text-xs font-bold px-2 mb-2 tracking-widest ${dark ? "text-slate-600" : "text-gray-300"}`}
      >
        MENU
      </p>

      {NAV_ITEMS.map(({ id, label, Icon, desc }) => {
        const active = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`
              w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left
              transition-all group
              ${
                active
                  ? "bg-blue-500 shadow-md shadow-indigo-500/30"
                  : dark
                    ? "hover:bg-slate-700"
                    : "hover:bg-gray-100"
              }
            `}
          >
            {/* Icon wrapper */}
            <span
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                ${
                  active
                    ? "bg-white/20"
                    : dark
                      ? "bg-slate-700 group-hover:bg-slate-600"
                      : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
            >
              <Icon
                size={15}
                className={
                  active
                    ? "text-white"
                    : dark
                      ? "text-slate-400"
                      : "text-gray-500"
                }
              />
            </span>

            <span className="flex-1 min-w-0">
              <span
                className={`block text-sm font-semibold ${active ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}`}
              >
                {label}
              </span>
              <span
                className={`block text-xs truncate ${active ? "text-indigo-200" : dark ? "text-slate-500" : "text-gray-400"}`}
              >
                {desc}
              </span>
            </span>

            {active && (
              <ChevronRight size={14} className="text-white/60 shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function BottomControls({ dark, dispatch }) {
  return (
    <div
      className={`
        mt-auto mx-3 mb-4 p-3 rounded-xl border space-y-3
        ${dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}
      `}
    >
      {/* Dark-mode toggle */}
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_DARK" })}
        className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
          ${
            dark
              ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }
        `}
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

function Logo({ dark, size = "full" }) {
  return (
    <div className="flex items-center gap-3 px-4 py-5 mb-2">
      {size === "full" && (
        <div>
          <p
            className={` text-2xl leading-none tracking-tight ${dark ? "text-white" : "text-gray-900"}`}
          >
            Finsight
          </p>
          <p
            className={`text-sm mt-1 ${dark ? "text-slate-500" : "text-gray-400"}`}
          >
            Finance Dashboard
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main export
export default function Sidebar() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavigate(id) {
    dispatch({ type: "SET_TAB", payload: id });
    setMobileOpen(false);
  }

  return (
    <>
      <aside
        className={`
          hidden lg:flex flex-col w-64 shrink-0 border-r
          h-screen sticky top-0 overflow-y-auto
          ${dark ? "bg-slate-900 border-slate-700/60" : "bg-white border-gray-200"}
        `}
      >
        <Logo dark={dark} />
        <NavList
          activeTab={state.activeTab}
          dark={dark}
          onNavigate={handleNavigate}
        />
        <BottomControls dark={dark} dispatch={dispatch} />
      </aside>

      {/* ── MOBILE top bar (below lg) ─────────────────────────────────── */}
      <div
        className={`
          lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14 border-b
          ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}
        `}
      >
        {/* Hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className={`p-2 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
        >
          <Menu
            size={18}
            className={dark ? "text-slate-300" : "text-gray-600"}
          />
        </button>

        {/* Mini logo */}
        <div className="flex items-center gap-2">
          <span
            className={`font-black text-base ${dark ? "text-white" : "text-gray-900"}`}
          >
            Finsight
          </span>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => dispatch({ type: "TOGGLE_DARK" })}
            className={`p-2 rounded-lg ${dark ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-gray-100 text-gray-600"}`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE drawer overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop — tap to close */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <aside
            className={`
              relative flex flex-col w-64 h-full shadow-2xl
              ${dark ? "bg-slate-900" : "bg-white"}
            `}
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-lg z-10 ${dark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            >
              <X
                size={16}
                className={dark ? "text-slate-400" : "text-gray-500"}
              />
            </button>

            <Logo dark={dark} />
            <NavList
              activeTab={state.activeTab}
              dark={dark}
              onNavigate={handleNavigate}
            />
            <BottomControls dark={dark} role={state.role} dispatch={dispatch} />
          </aside>
        </div>
      )}
    </>
  );
}
