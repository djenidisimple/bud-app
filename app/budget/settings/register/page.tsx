'use client'

import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6 px-10">
          <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40 transform rotate-3">
              <GalleryVerticalEnd className="size-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-foreground mb-2">
            Nouvel Accès
          </CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground">
            Configurez un nouvel utilisateur pour votre espace BudApp
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <RegisterForm />
          <div className="mt-8 pt-6 border-t border-border/60 flex justify-center">
            <Button 
              variant="ghost" 
              asChild 
              className="text-muted-foreground font-bold hover:text-primary transition-colors"
            >
              <Link href="/budget/settings" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux paramètres
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
