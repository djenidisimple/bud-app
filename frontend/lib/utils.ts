import { Make, Resource } from "@/types/UtilsTypes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const filterMake = (array: Make[], id: number): Make[] => {
    return array.filter( (item: { ressource_id: number; }) => item.ressource_id === id);
}

export function editMoney(value: any, separator = ',') {
  if (value === null || value === undefined || isNaN(Number(value))) return '0';
  const moneyToString:string = value.toString();
  return moneyToString.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export const calculateRemainingResources = (inputsMake: Make[], totalResources: number) => {
  const totalExpenses = inputsMake.reduce((acc, item) => acc + item.prix, 0);
  return totalResources - totalExpenses;
};

export const remplirStayResource = (
  inputsRes: Resource[], 
  inputsMake: Make[], 
  setStayResource?: React.Dispatch<React.SetStateAction<{ id: number; name: string | undefined; prix: number; }[]>>
) => {
    
      const updatedResources = inputsRes.map(item => {
      const depensesCorrespondantes = inputsMake.filter(depense => depense.ressource_id === item.id);
      const totalDepensesPourRessource = depensesCorrespondantes.reduce((acc, depense) => acc + depense.prix, 0);

        // We calculate the remaining price by subtracting the total expenses from the resource's initial price.
        const prixRestant = (item.prix ?? 0) - totalDepensesPourRessource;
        
        return {
          id: item.id,
          name: item.name,
          prix: prixRestant,
        };
      });
      if (setStayResource) {
          setStayResource(updatedResources);
      }
};