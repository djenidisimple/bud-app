'use client'

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react"
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nom d'utilisateur</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="name"
            className="pl-10 h-12 rounded-xl border-border/60 focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Entrez votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoComplete="username"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mot de passe</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            className="pl-10 pr-10 h-12 rounded-xl border-border/60 focus:ring-2 focus:ring-primary/20 transition-all"
            type={showPassword ? "text" : "password"}
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-95" disabled={loading}>
        {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}
