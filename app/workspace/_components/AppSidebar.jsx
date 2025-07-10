"use client"

import React from "react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu
} from "@/components/ui/sidebar"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  CreditCard,
  User2
} from "lucide-react";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const SidebarOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace/#',
  },
  {
    title: 'My Learning',
    icon: BookOpen,
    path: '/workspace/my-learning',
  },
  {
    title: 'Explore Courses',
    icon: Compass,
    path: '/workspace/explore'
  },
  {
    title: 'Billing',
    icon: CreditCard,
    path: '/workspace/billing',
  },
  {
    title: 'Profile',
    icon: User2,
    path: '/workspace/profile',
  },
];

function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={'p-4'}>
        <Link href="/" className="cursor-pointer">
          <Image src={'/logo.svg'} alt='logo' width={150} height={100} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>
              Create New Course
            </Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={'p-5'}>
                    <Link href={item.path} className={`text-[17px]
                      ${path.includes(item.path) && 'text-primary bg-red-50'}`}>
                      <item.icon className='h-7 w-7' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar