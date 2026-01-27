import { Project } from "@/components/data-project";
import { axiosInstance } from "./axios";

export async function fetchById(id: number) {
    const response = await axiosInstance.get('/api/getData', {
        params: { projectId: Number(id) }
    });
    try {
        return response.data.Data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

export async function register(passwordStrength: number, form: { name: string, password: string }) {
    if (passwordStrength < 2) {
        alert('Le mot de passe doit contenir au moins 6 caractères.');
    } else {
        const response = await axiosInstance.post('/api/register', form);
        if (response.status == 519) {
            alert('Le nom de l\'utilisateur existe deja!');
        } else if (response.status === 200) {
            alert('Registered successfully');
        }
        window.location.href = '/budget/dashboard';
    }
} 

export const deleteData = async (id: number, setData: React.Dispatch<React.SetStateAction<Project[]>>) => {
    const response2 = await axiosInstance.delete(`/api/deleteProject?id=${id}`);
    if (response2.status !== 200) {
        throw new Error("Erreur Http Status : " + response2.data.status);
    }
    if (response2.data.Ok) {
        setData(prevData => prevData.filter((item) => item.id !== id));
        alert(response2.data.message);
    }
};

export const updateData = async (
    id: number, 
    formData: {name_project: string, description_project: string},
    setData: React.Dispatch<React.SetStateAction<Project[]>>, 
    setFormData: React.Dispatch<React.SetStateAction<{name_project: string, description_project: string}>>
) => {
    const response3 = await axiosInstance.post(`/api/updateProject?id=${id}`, { ...formData });
    if (response3.status !== 200) {
        throw new Error("Erreur Http Status : " + response3.data.status);
    }
    if (response3.data.Ok) {
        setData(prevData => prevData.map(item => item.id === id ? { ...item, name_project: formData.name_project, description_project: formData.description_project } : item));
        setFormData({ name_project: '', description_project: '' });
        alert(response3.data.message);
    }
};

export const addProject = async (
    id: number | null,
    data: Project[],
    formData: {name_project: string, description_project: string},
    setData: React.Dispatch<React.SetStateAction<Project[]>>, 
    setFormData: React.Dispatch<React.SetStateAction<{name_project: string, description_project: string}>>
) => {
    const response = await axiosInstance.post(`/api/addProject?id=${id}`, formData);
    if (response.data.status === 201) {
        const lastId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
        setData(prevData => [...prevData, { id: response.data.project.id, name_project: formData.name_project, description_project: formData.description_project }]);
        setFormData({ name_project: '', description_project: '' });
        alert('Projet créé avec succès!');
    } else {
        console.table(response.data)
    }
}

export async function fetchDataAll() {
    const response = await axiosInstance.get(`/api/getDataMonthsYears`);
    return response.data.Data;
}

export async function fetchDataByMonthsYears(months: string, years: number) {
    const response = await axiosInstance.post(`/api/getDataByFilter`, {months: months, years: years});
    return response.data.data;
}

export async function handleLogout() {
    const token = localStorage.getItem('token');
    try {
        await axiosInstance.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        });
        localStorage.removeItem('token');
        window.location.href = '';
    } catch {
        alert('Logout failed');
    }
};