"use client"

import { BugIcon, Minus, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

// Déclaration des types pour l'API Electron
declare global {
  interface Window {
    electron?: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      isMaximized: () => Promise<boolean>
      onWindowStateChange: (callback: (isMaximized: boolean) => void) => void
    }
  }
}

export function SiteHeader() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // Vérifier si nous sommes dans Electron
    if (window.electron) {
      // Obtenir l'état initial de la fenêtre
      window.electron.isMaximized().then(setIsMaximized)
      
      // Écouter les changements d'état de la fenêtre
      window.electron.onWindowStateChange(setIsMaximized)
    }
  }, [])

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimizeWindow()
    }
  }

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.maximizeWindow()
    }
  }

  const handleClose = () => {
    if (window.electron) {
      window.electron.closeWindow()
    }
  }

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full h-10 p-2 items-center border-b select-none">
      {/* Logo et titre de l'application */}
      <div className="flex items-center ml-2">
        <BugIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Mon Application</span>
      </div>
      
      {/* Barre de recherche ou autre contenu au centre */}
      <div className="flex-1 flex justify-center">
        {/* Vous pouvez placer votre SearchForm ici si nécessaire */}
      </div>
      
      {/* Contrôles de fenêtre Electron */}
      <div className="flex items-center">
        <Button 
          className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-0 rounded-none"
          variant="ghost" 
          onClick={handleMinimize}
          title="Minimiser"
        >
          <Minus className="size-3" />
        </Button>
        <Button 
          className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-0 rounded-none"
          variant="ghost" 
          onClick={handleMaximize}
          title={isMaximized ? "Restaurer" : "Agrandir"}
        >
          {isMaximized ? (
            <Square className="size-3" style={{ transform: 'scale(0.8)' }} />
          ) : (
            <Square className="size-3" />
          )}
        </Button>
        <Button 
          className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white focus-visible:ring-0 rounded-none"
          variant={"ghost"}
          onClick={handleClose}
          title="Fermer"
        >
          <X className="size-4" />
        </Button>
      </div>
    </header>
  )
}
