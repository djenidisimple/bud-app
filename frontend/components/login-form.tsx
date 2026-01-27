"use client"
import { Coins, EyeIcon, EyeOffIcon, GalleryVerticalEnd, WalletCards } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from '@/context/AuthContext'
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', password: '' })
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
          setLoading(true)
          await login(form)
      } catch {
          toast.error('Identifiants incorrects')
      } finally {
        setLoading(false)
      }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
            >
              <div 
                className="
                    flex size-8 items-center 
                    justify-center bg-neutral-200 
                    rounded-full
                    w-20 h-20
                "
              >
                <WalletCards className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenu sur BudMan </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                  id="username"
                  type="text"
                  placeholder="nom d'utilisateur"
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="mot de passe">Mot de passe</Label>
              <div className="relative">
                  <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 focus-within:border-indigo-600 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] hover:border-gray-400">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      required
                      className="w-full py-3 px-4 border-0 focus:ring-0 bg-transparent text-gray-700 placeholder-gray-400"
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, password: value});
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
            </div>
            <Button type="submit" className="w-full">
                  {loading ? "chargement..." : "se connnecter"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
