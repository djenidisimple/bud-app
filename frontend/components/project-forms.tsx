"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NewspaperIcon,Loader2 } from "lucide-react"

import { useState } from 'react'
import { axiosInstance } from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"

export default function FormProject({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState({
        name_project: '',
        description_project: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(`/api/addProject?id=${user?.id}`, formData);
            
            if (response.data.status === 201) {
                // Fermer le dialogue
                onClose(); 
                // Réinitialiser le formulaire
                setFormData({ name_project: '', description_project: '' });
                alert('Projet créé avec succès!');
                window.location.reload();
            } else if (response.data.status === 19) {
                setError('Le nom du project exist déjà!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl">
                <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <NewspaperIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Création de Projet
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Créez un nouveau projet pour votre organisation
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nameProject">Nom du projet *</Label>
                            <Input
                                id="nameProject"
                                name="name_project"
                                value={formData.name_project}
                                onChange={handleChange}
                                placeholder="Nommez votre projet"
                                required
                                className="focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description_project"
                                value={formData.description_project}
                                onChange={handleChange}
                                placeholder="Décrivez brièvement votre projet"
                                className="focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-100 dark:bg-red-900/50 p-3 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            className="w-full sm:w-auto"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}