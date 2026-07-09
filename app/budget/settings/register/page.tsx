'use client'

import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#dfe1e7]">
      <div className="w-full max-w-md bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
        <div className="text-center pt-10 pb-6 px-10">
          <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-[#4f5bd5] text-white shadow-sm transform rotate-3">
               <GalleryVerticalEnd className="size-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1f2229] mb-2">
            Nouvel Accès
          </h2>
          <p className="text-sm font-medium text-[#6b7078]">
            Configurez un nouvel utilisateur pour votre espace BudApp
          </p>
        </div>
        <div className="px-10 pb-10">
          <RegisterForm />
          <div className="mt-8 pt-6 border-t border-[#e6e7eb] flex justify-center">
            <Button 
              variant="ghost" 
              asChild 
              className="text-[#6b7078] font-medium hover:text-[#4f5bd5] transition-colors"
            >
              <Link href="/budget/settings" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux paramètres
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
