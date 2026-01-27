import { SetStateAction } from "react";
import { Budget, Details } from "./BudgetTypes";

export type Make = {
    detail_id: number;
    id: number;
    prix: number;
    ressource_id: number;
    stayResource?: { id: number; name: string | undefined; prix: number; }[];
    stay?: number;
}

export type Spend = {
    id: number;
    name: string;
}

export type Resource = { 
    id: number; 
    name?: string; 
    prix?: number; 
    date?: Date;
}

export type Detail = {
    id: number;
    value: string;
    depense_id: number;
}

export type SpendDataBase = {
    id: number;
    name: string;
    price: number;
    date: Date;
}

export type ItemsDate = {
    id: number;
    date: string;
}

export type ChartData = {
    id: number;
    price_resource: number;
    price_spend: number;
    date: Date;
}

export type Fields = 'resource' | 'spend' | 'detail' | 'make' | 'depense' | 'date';

export type FieldSetters = {
        resources?: (value: SetStateAction<Resource[]>) => void;
        spends?: (value: SetStateAction<Spend[]>) => void;
        details?: (value: SetStateAction<Detail[]>) => void;
        makes?: (value: SetStateAction<Make[]>) => void;
        data?: (value: SetStateAction<Budget>) => void;
        depense?: (value: SetStateAction<ChartData[] | undefined>) => void;
        date?: (value: SetStateAction<ItemsDate[] | undefined>) => void;
        setStayResource?: (value: SetStateAction<{ id: number; name: string | undefined; prix: number; }[]>) => void;
        setSave?: (value: SetStateAction<number>) => void;
};
export type FieldVariable = {
    resource?: Resource[];
    spend?: Spend[];
    detail?: Details[];
    make?: Make[];
}