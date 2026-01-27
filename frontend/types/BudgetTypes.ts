import { Details_DB, Makes_DB, Resource_DB, Spend_DB } from "./DataBaseType";
import { Detail, Make, Resource, Spend } from "./UtilsTypes";

export type Depenses = { id: number, name?: string, update?: boolean }; 

export type Resources = { id: number, name?: string, prix: number, update?: boolean }; 

export type Details = { id: number, value?: string, depense_id?: number, update?: boolean }; 

export type Makes = { id: number, detail_id: number, prix?: number, ressource_id: number, update?: boolean }; 

export type Budget = {
    depense: Depenses[];
    ressource: Resources[];
    detail: Details[];
    make: Makes[];
}

export type ValueInputs = {
  resource?: Resource[];
  spend?: Spend[];
  detail?: Detail[];
  make?: Make[];
};

export type ApiDataBase = {
    resource?: Resource_DB[], 
    spend?: Spend_DB[], 
    detail?: Details_DB[], 
    make?: Makes_DB[]
};