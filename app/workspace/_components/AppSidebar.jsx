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
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const SidebarOptions=[
    {
        title:'Dashboard',
        icon:LayoutDashboard,
        path:'/workspace',
    },
      {
        title:'My Progress',
        icon:LayoutDashboard,
        path:'/#',
    },

      {
        title:'Explore Courses',
        icon:LayoutDashboard,
        path:'/#'
    },

    {
        title:'AI Tools',
        icon:LayoutDashboard,
        path:'/#',
 
    },
    
    {
        title:'Dashboard',
        icon:LayoutDashboard,
        path:'/#',
    },

];


function AppSidebar() {
    const path= usePathname();

    return (
        <Sidebar>
            <SidebarHeader className={'p-4'}>
                <Image src={'/logo.svg'} alt='logo' width={150} height={100}/>
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
                            {SidebarOptions.map((item,index)=>(
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild className={'p-5'}>
                                        <Link href={item.path} className={`text-[17px]
                                         ${path.includes(item.path) && 'text-primary bg-red-50'}`}>
                                        <item.icon className='h-7 w-7'/>
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