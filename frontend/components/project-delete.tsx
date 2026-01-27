import { Dialog, DialogTitle, DialogContent, DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { deleteData } from "@/lib/requestApi";
import { Project } from "./data-project";
import { TrashIcon } from "lucide-react";

export function ProjectDelete(
    {
        open,
        setOpen,
        selectedId,
        setData
    }: {
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>,
        selectedId: number | null,
        setData: React.Dispatch<React.SetStateAction<Project[]>>,
    }
) {
    const handleDelete = () => {
        if (selectedId !== null) {
            deleteData(selectedId, setData);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
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
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
                            <TrashIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Supprimer le projet
                        </DialogTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.
                        </p>
                    </DialogHeader>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                        >
                            Supprimer
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}