import { Budget } from "@/types/BudgetTypes";
import { Inputs } from "@/types/InputsTypes";
import { Detail, Make, Resource, Spend } from "@/types/UtilsTypes";

export const addInput = (setter: React.Dispatch<React.SetStateAction<Inputs[]>>, array: Inputs[]) => {
    const newId = array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
    setter([...array, { id: newId, value: '' }]);
}

export const addInputSpend = (setter: React.Dispatch<React.SetStateAction<Spend[]>>, array: Spend[]) => {
    const newId = array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
    setter([...array, { id: newId, name: '' }]);
}

export const addInputResource = (setter: React.Dispatch<React.SetStateAction<Resource[]>>, array: Resource[]) => {
    const newId = array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
    setter([...array, { id: newId, name: '', prix: 0 }]);
}

export const addInputDetail = (
    setter: React.Dispatch<React.SetStateAction<Detail[]>>, 
    setterData: React.Dispatch<React.SetStateAction<Budget>>,
    nameSpend: String,
    array: Detail[],
    depense_id: number
) => {
    if (nameSpend.length === 0) {
        alert("Le champs dépense est encore vide!")
    } else {
        const newId = array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
        setter([...array, { id: newId, value: '', depense_id: depense_id }]);
        setterData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    detail: [
                        ...prev.detail,
                        { id: newId, value: '', depense_id: depense_id }
                    ]
                }
        });
    }
}

export const addInputMake = (
    setter: React.Dispatch<React.SetStateAction<Make[]>>, 
    setterData: React.Dispatch<React.SetStateAction<Budget>>, 
    array: Make[], 
    details: Detail[], 
    resourceId: number,
    stayResource: number
) => {
    const newId = array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
    const detailId = details.length > 0 ? Math.max(...details.map(i => i.id)) : 1;
    const countMake = array.filter(items => items.ressource_id === resourceId);
    const newDetailId = countMake.length === 0 ? Math.min(...details.map(i => i.id)) : Math.max(...countMake.map(i => i.detail_id)) + 1;
    if (detailId >= newDetailId && stayResource > 0 || array.length == 0 && details.length > 0) {
        setter([...array, { detail_id: newDetailId, id: newId, prix: 0, ressource_id: resourceId }]);
        setterData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                make: [
                    ...prev.make,
                    { 
                        detail_id: newDetailId, 
                        id: newId, 
                        prix: 0, 
                        ressource_id: resourceId 
                    }
                ]
            }
        });
    } else if (stayResource <= 0) {
        alert("Cette ressource n'est plus disponible pour une dépense.");
    } else {
        alert('Veuilliez d\'abord ajouter une nouvelle detail de depense!');
    }
}