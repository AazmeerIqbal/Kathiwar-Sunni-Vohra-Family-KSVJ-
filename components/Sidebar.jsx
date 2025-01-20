"use client";

import { ChevronFirst, ChevronLast, MoreVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { signOut } from "next-auth/react";
import GradientText from "./ui/GradientText";

const SidebarContext = createContext();

export default function Sidebar({ children, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/login" });
  };

  const toggleSidebar = () => {
    setExpanded((curr) => {
      const newState = !curr;
      if (onToggle) onToggle(newState); // Pass the updated state to the parent
      return newState;
    });
  };

  return (
    <>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            /> */}
            <span
              className={`overflow-hidden transition-all text-3xl  font-bold tracking-wide ${
                expanded ? "ml-2" : "w-0"
              }`}
            >
              <GradientText
                colors={["#00e5ff", "#0047ab", "#00e5ff"]}
                animationSpeed={4}
                showBorder={false}
                className="text-start"
              >
                KSVJ
              </GradientText>
            </span>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3 ">
            {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
            <div className="flex justify-between items-center overflow-hidden transition-all w-full mx-3">
              <div className={`leading-4 ${expanded ? "block" : "hidden"}`}>
                <h4 className="font-semibold">KSVJ</h4>
                <span className="text-xs text-gray-600">
                  Kathiwar Sunni Vohra Family
                </span>
              </div>
              <LogOut
                className={`cursor-pointer`}
                onClick={handleLogout}
                size={20}
              />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-[100]`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
