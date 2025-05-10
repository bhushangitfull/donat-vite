"use client"

import * as React from "react"
import {
    Calendar,
    Newspaper,
    Settings,
    Menu,
    LayoutDashboard,
} from "lucide-react"
import NewsForm from './NewsForm';
import MenuForm from './MenuForm';
import EventForm from './EventForm';
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Santosh Kamble",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "",
      icon: LayoutDashboard,
      isActive: true,
    },
    
    {
      title: "Events",
      url: "/EventsForm",
      icon: Calendar,
    },
    {
      title: "News",
      url: "#",
      icon: Newspaper,
    },
    {
      title: "Menu",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
