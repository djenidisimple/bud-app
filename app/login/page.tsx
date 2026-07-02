'use client'

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState("login")

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-5" />
            </div>
          </div>
          <CardTitle className="text-xl">
            {mode === "login" ? "Connexion" : "Inscription"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Connectez-vous pour accéder à votre espace"
              : "Créez un compte pour commencer"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <>
              <LoginForm />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Pas encore de compte ?{" "}
                <button onClick={() => setMode("register")} className="text-primary underline">
                  S&apos;inscrire
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={() => setMode("login")} />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Déjà un compte ?{" "}
                <button onClick={() => setMode("login")} className="text-primary underline">
                  Se connecter
                </button>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
