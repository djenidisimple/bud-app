'use client'

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState("login")

  return (
    <div className="flex min-h-svh items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6 px-10">
          <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <GalleryVerticalEnd className="size-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-foreground mb-2">
            {mode === "login" ? "Bon retour !" : "Bienvenue !"}
          </CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground">
            {mode === "login"
              ? "Accédez à votre gestion budgétaire en un clic"
              : "Créez votre compte et commencez à optimiser vos finances"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <div className="relative">
            {mode === "login" ? (
              <>
                <LoginForm />
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground font-bold tracking-widest">Ou alors</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground text-center">
                  Vous n'avez pas encore de compte ?{" "}
                  <Button 
                    variant="link" 
                    className="text-primary font-bold hover:no-underline p-0" 
                    onClick={() => setMode("register")}
                  >
                    S&apos;inscrire maintenant
                  </Button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onSuccess={() => setMode("login")} />
                <p className="text-sm font-medium text-muted-foreground mt-8 text-center">
                  Déjà un membre ?{" "}
                  <Button 
                    variant="link" 
                    className="text-primary font-bold hover:no-underline p-0" 
                    onClick={() => setMode("login")}
                  >
                    Se connecter
                  </Button>
                </p>
              </>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Données sécurisées & cryptées
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
