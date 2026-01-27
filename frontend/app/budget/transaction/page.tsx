"use client"
import { Button } from "@/components/ui/button";
import { Folder, PlusIcon } from "lucide-react";
import FormProject from "@/components/project-forms";
import { useState } from "react";
import DataProject from "@/components/data-project";


export default function Transaction() 
{
    const [isOpen, setIsOpen] = useState(false);
    const [add, setAdd] = useState(false);

    const handleShow = () => {
        setIsOpen(true);
    };

    return (
        <>
            <div className="w-full mx-auto">
                <FormProject open={isOpen} onClose={() => setIsOpen(false)} />
                
                <div 
                    className="
                            pl-5
                            py-5
                            flex flex-col sm:flex-row 
                            justify-between items-start 
                            sm:items-center gap-4 mb-8
                        "
                >
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            <Folder 
                                className="
                                    inline-block mr-2
                                " 
                                size={36}
                                fill="blue"
                                color="blue"
                            />
                            Project
                        </h1>
                        <p className="text-gray-500 text-sm">Gestion de tous les projets</p>
                        <Button 
                            variant={"outline"}
                            onClick={() => setIsOpen(true)}
                            className="
                                border-1 rounded-md
                                hover:bg-blue-600
                                hover:text-white
                                border-blue-600
                                text-blue-600
                            "
                        >
                            <PlusIcon 
                                size="20" 
                            />
                            Ajouter
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap">
                    <DataProject 
                        add={add}
                        setAdd={setAdd}
                    />
                </div>
            </div>
        </>
    );
}