import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { SettingsIcon, NewspaperIcon, Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { addProject, updateData } from "@/lib/requestApi";
import { Project } from "./data-project";
import { useAuth } from "@/context/AuthContext";

export function ProjectForm(
    {
        id,
        add,
        setAdd,
        selectedId,
        openForm,
        setOpenForm,
        data,
        setData,
        formData,
        setFormData,
        onSubmit
    }:
    { 
        id: number,
        add: boolean,
        setAdd: React.Dispatch<React.SetStateAction<boolean>>,
        selectedId: number | null,
        openForm: boolean,
        setOpenForm: React.Dispatch<React.SetStateAction<boolean>>,
        formData: { name_project: string, description_project: string },
        data: Project[],
        setData: React.Dispatch<React.SetStateAction<Project[]>>,
        setFormData: React.Dispatch<React.SetStateAction<{ name_project: string, description_project: string }>>,
        onSubmit: () => Promise<void>
    }
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Définition des éléments d'interface basés sur la prop 'add'
    const title = add ? "Création de Projet" : "Modification du Projet";
    const description = add ? "Créez un nouveau projet pour votre organisation" : "Mettez à jour les détails de votre projet.";
    const icon = add ? <NewspaperIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" /> : <SettingsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (add) {
                // Logique pour la création
                await addProject( id, data, formData, setData, setFormData);
            } else if (selectedId) {
                // Logique pour la modification
                await updateData(selectedId, formData, setData, setFormData);
            }
            setOpenForm(false);
        } catch (err) {
            setError("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openForm || add} onOpenChange={ add == true ? setAdd : setOpenForm}>
            <DialogContent
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                className="
                    fixed inset-0 z-50 flex items-center justify-center
                    bg-black/50 backdrop-blur-sm
                    transition-all duration-300
                "
            >
                <div className="
                    sm:max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl
                    transform transition-all duration-300 scale-100 opacity-100
                ">
                    <DialogHeader className="flex flex-col items-center text-center space-y-4">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                            {icon}
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </DialogTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {description}
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameProject">Nom du projet *</Label>
                                <Input
                                    id="nameProject"
                                    name="name"
                                    value={formData.name_project}
                                    onChange={e => setFormData({ ...formData, name_project: e.target.value })}
                                    placeholder="Nommez votre projet"
                                    required
                                    className="focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-700 dark:text-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description_project}
                                    onChange={e => setFormData({ ...formData, description_project: e.target.value })}
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
                                onClick={() => {
                                    setOpenForm(false);
                                    setAdd(false);
                                }}
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
                </div>
            </DialogContent>
        </Dialog>
    );
}