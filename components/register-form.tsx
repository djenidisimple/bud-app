'use client'

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react"
import { toast } from "sonner"

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return Math.min(score, 4)
  }

  const strength = getStrength(password)
  const strengthLabel = ["Faible", "Moyen", "Bon", "Fort", "Très fort"][strength]
  const strengthColor = [
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ][strength]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }
    setLoading(true)
    try {
      await register(name, password)
      toast.success("Inscription réussie")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur d'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nom d'utilisateur</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="reg-name"
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
        <Label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mot de passe</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="reg-password"
            className="pl-10 pr-10 h-12 rounded-xl border-border/60 focus:ring-2 focus:ring-primary/20 transition-all"
            type={showPassword ? "text" : "password"}
            placeholder="Créez un mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
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
        {password && (
          <div className="space-y-2 px-1">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < strength ? strengthColor : 'bg-muted'}`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Force: {strengthLabel}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirmer le mot de passe</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="reg-confirm"
            className="pl-10 h-12 rounded-xl border-border/60 focus:ring-2 focus:ring-primary/20 transition-all"
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-95" disabled={loading}>
        {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
        {loading ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  )
}
