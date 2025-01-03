import React from "react";
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
import Sidebar, { SidebarItem } from "@/components/Sidebar";
import { useSession } from "next-auth/react";

const Dashboard = ({ children }) => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      <div>
        <div className="flex">
          <Sidebar>
            <Link href="/">
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                active
              />
            </Link>
            <Link href="/">
              <SidebarItem
                icon={<StickyNote size={20} />}
                text="Projects"
                alert
              />
            </Link>
            <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
            <SidebarItem icon={<Layers size={20} />} text="Tasks" />
            <SidebarItem icon={<Flag size={20} />} text="Reporting" />
            <hr className="my-3" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
            <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
          </Sidebar>
          <div className="w-full">
            <div className="w-full h-16 border-r shadow-sm">
              <div className="flex justify-between h-full items-center p-6">
                <div>Dashboard</div>
                <div className="flex gap-3">
                  <div className="cursor-pointer border-2 border-gray-300 rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CircleUserRound className="text-white w-8 h-8" />
                  </div>

                  <div className="text-sm">
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
      </div>
    </>
  );
};

export default Dashboard;
