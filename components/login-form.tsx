'use client'

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setLoading(true)
    try {
      await login(name, password)
      toast.success("Connexion réussie")
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom d'utilisateur</Label>
        <Input
          id="name"
          placeholder="Entrez votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : null}
        Se connecter
      </Button>
    </form>
  )
}
