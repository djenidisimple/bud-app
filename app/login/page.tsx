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
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#dfe1e7]">
      <div className="w-full max-w-md bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
        <div className="text-center pt-10 pb-6 px-10">
          <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-[#4f5bd5] text-white shadow-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <GalleryVerticalEnd className="size-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1f2229] mb-2">
            {mode === "login" ? "Bon retour !" : "Bienvenue !"}
          </h2>
          <p className="text-sm font-medium text-[#6b7078]">
            {mode === "login"
              ? "Accédez à votre gestion budgétaire en un clic"
              : "Créez votre compte et commencez à optimiser vos finances"}
          </p>
        </div>
        <div className="px-10 pb-10">
          <div className="relative">
            {mode === "login" ? (
              <>
                <LoginForm />
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#e6e7eb]" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#6b7078] font-bold tracking-widest">Ou alors</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#6b7078] text-center">
                  Vous n'avez pas encore de compte ?{" "}
                  <Button 
                    variant="link" 
                    className="text-[#4f5bd5] font-bold hover:no-underline p-0" 
                    onClick={() => setMode("register")}
                  >
                    S&apos;inscrire maintenant
                  </Button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onSuccess={() => setMode("login")} />
                <p className="text-sm font-medium text-[#6b7078] mt-8 text-center">
                  Déjà un membre ?{" "}
                  <Button 
                    variant="link" 
                    className="text-[#4f5bd5] font-bold hover:no-underline p-0" 
                    onClick={() => setMode("login")}
                  >
                    Se connecter
                  </Button>
                </p>
              </>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-[#9498a0] uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Données sécurisées & cryptées
          </div>
        </div>
      </div>
    </div>
  )
}
