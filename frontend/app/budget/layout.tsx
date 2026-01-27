"use client"
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';

export default function BudgetLayout(
    { children }: { children: ReactNode }
) 
{
    const { loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            const currentPath = window.location.pathname + window.location.search
            router.push(`/login?from=${encodeURIComponent(currentPath)}`)
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return (
        <>
            <div>
                <SidebarProvider className="flex flex-col">
                    <div 
                        className="flex flex-1"
                    >
                        <AppSidebar />
                        <SidebarInset 
                            className="
                                flex-1 min-w-0 
                                min-h-0 p-0 -ml-48
                            "
                        >
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </>
        )
    }

    return (
        <>
            <div>
                <SidebarProvider className="flex flex-col">
                    <div 
                        className="flex flex-1"
                    >
                        <AppSidebar />
                        <SidebarInset 
                            className="
                                flex-1 min-w-0 
                                min-h-0 p-0 -ml-48
                            "
                        >
                            <div className="flex flex-1 flex-col">
                                {children}
                                <Toaster />
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </>
    );
}
