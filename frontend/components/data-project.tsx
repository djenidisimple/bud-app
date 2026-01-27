
import { axiosInstance } from '@/lib/axios';
import { ArrowRight, Edit, LucideFolders, Trash2 } from 'lucide-react';
import { useState, useEffect } from "react";
import { Button } from './ui/button';
import Link from 'next/dist/client/link';
import { ProjectForm } from './projet-forms';
import { ProjectDelete } from './project-delete';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
export interface Project {
    id: number;
    name_project: string;
    description_project: string;
}

export default function DataProject(
    {
        add,
        setAdd
    } : {
        add : boolean,
        setAdd: React.Dispatch<React.SetStateAction<boolean>>,
    }
) {
    const { user } = useAuth()
    const id = user?.id ?? 0;
    const [data, setData] = useState<Project[]>([]);
    const [formData, setFormData] = useState({name_project: '', description_project: ''});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleFormSubmit = async () => {
        toast.error("Soumission des données du formulaire !");
    };

    const getDataById = async (id: number) => {
        const response4 = await axiosInstance.get(`/api/getByIdProject?id=${id}`);
        if (response4.status !== 200) {
            throw new Error("Erreur Http Status : " + response4.data.status);
        }
        if (response4.data.project) {
            setFormData({
                name_project: response4.data.project.name_project || '',
                description_project: response4.data.project.description_project || ''
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/getProject');
                if (response.status !== 200) {
                    throw new Error("Erreur Http Status : " + response.data.status);
                }
                setData(response.data.project as Project[]);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Erreur inconnue');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erreur : {error}</p>;
    }

    if (!data || data.length === 0) {
        return <p>0 résultat !</p>;
    }
    
    return (
        <>
            {Array.isArray(data) ?
                data.map((project) => (
                <div
                    key={project.id}
                    className="
                        w-58
                        group relative
                        border-1 border-neutral-400 rounded-sm
                        overflow-hidden
                        m-4
                    "
                >

                    <div 
                        className="
                                absolute top-4 left-4 p-2 
                                bg-blue-100
                                rounded-full
                            "
                        >
                        <LucideFolders size={24} className="dark:text-blue-400" />
                    </div>

                    <div className="flex flex-col p-6 space-y-4 mt-2">
                        <h3 className="text-xl font-bold mt-8 mb-10">
                            {project.name_project}
                            <p className="text-sm font-normal mt-2">
                                {project.description_project || "Ceci est une brève description du projet."}
                            </p>
                        </h3>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                            <Link
                                href={`/budget/transaction/${project.id}`}
                                className="
                                    flex items-center gap-2
                                    font-semibold transition-colors
                                "
                            >
                                Accéder
                                <ArrowRight size={16} />
                            </Link> 

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="
                                        h-8 w-8 rounded-full
                                    "
                                    onClick={() => {
                                        setSelectedId(project.id);
                                        getDataById(project.id);
                                        setOpenEdit(true);
                                    }}
                                >
                                    <Edit size={16} />
                                    <span className="sr-only">Éditer le projet</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="
                                        h-8 w-8 rounded-full
                                    "
                                    onClick={() => {
                                        setSelectedId(project.id);
                                        setOpen(true);
                                    }}
                                >
                                    <Trash2 size={16} />
                                    <span className="sr-only">Supprimer le projet</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : null }

            <ProjectDelete
                open={open}
                setOpen={setOpen}
                selectedId={selectedId}
                setData={setData}
            />

            <ProjectForm
                id={id}
                add={add}
                setAdd={setAdd}
                selectedId={selectedId}
                openForm={openEdit}
                setOpenForm={setOpenEdit}
                data={data}
                setData={setData}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
            />
        </>
    );
}