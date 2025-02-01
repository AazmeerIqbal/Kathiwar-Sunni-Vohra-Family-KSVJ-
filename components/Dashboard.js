"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
  CircleUserRound,
} from "lucide-react";
import { IoMdInformationCircleOutline, IoIosDocument } from "react-icons/io";
import { encrypt } from "@/utils/Encryption";
import { usePathname } from "next/navigation";

import Sidebar, { SidebarItem } from "@/components/Sidebar";
import GradientText from "./ui/GradientText";
import { useSession } from "next-auth/react";

const Dashboard = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname(); // Get the current path
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // console.log(session);
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
    console.log("Sidebar is now:", isOpen ? "Open" : "Closed");
    console.log(session.user);
  };
  return (
    <>
      <div className="flex">
        <Sidebar onToggle={handleSidebarToggle}>
          <Link href="/">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              alert
            />
          </Link>
          <Link href={`/update-information?cnic=${encrypt(session.user.cnic)}`}>
            <SidebarItem
              icon={<IoMdInformationCircleOutline size={20} />}
              text="Update Information"
              active={pathname?.includes(
                `/update-information?cnic=${encrypt(session.user.cnic)}`
              )}
            />
          </Link>
          <Link href="/news-letter">
            <SidebarItem
              icon={<IoIosDocument size={20} />}
              text="News Letter"
              active={pathname?.includes("/news-letter")}
            />
          </Link>
          <SidebarItem
            icon={<Calendar size={20} />}
            text="Contribution Detail"
          />
          <SidebarItem icon={<Layers size={20} />} text="Event Attendace" />
          <SidebarItem icon={<Flag size={20} />} text="Reporting" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </Sidebar>
        <div className="w-full">
          <div className="w-full h-16 border-r shadow-sm">
            <div className="flex justify-between h-full items-center p-6">
              <div className="font-bold md:text-3xl text-2xl">
                {isSidebarOpen ? (
                  ""
                ) : (
                  <GradientText
                    colors={["#00e5ff", "#0047ab", "#00e5ff"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="text-start"
                  >
                    KSVJ
                  </GradientText>
                )}{" "}
              </div>
              <div className="flex md:gap-3 gap-2 items-center">
                <div className="cursor-pointer border-2 border-gray-300 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-shadow duration-300 p-1 ">
                  <CircleUserRound className="text-white md:h-8 md:w-8 h-6 w-6" />
                </div>

                <div className="md:text-sm text-xs">
                  {session ? (
                    <>
                      <p className="font-bold">{session.user.name}</p>
                      <p>{session.user.email}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">Guest</p>
                      <p>guest@example.com</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
