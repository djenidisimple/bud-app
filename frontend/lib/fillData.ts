import { Data_DB, Details_DB, Makes_DB, Resource_DB, Spend_DB, Years_DB } from "@/types/DataBaseType";
import { Fields, FieldSetters } from "@/types/UtilsTypes";
import { addDataBase } from "./handleBudgetInputChange ";

export const fillData = (
    id?: number,
    apiData: any,
    fields: Fields[], // can to be resource, spend, make, detail,
    setters: FieldSetters = {}
) => {
    fields.forEach(field => {
        
        addDataBase(field, apiData, setters);

        switch (field) {
            

            case "depense":
                if (setters.depense) {
                    setters.depense(
                        apiData.dataChart.map((res: Data_DB) => ({
                            id: res.id,
                            price_resource: res.price_resource ?? 0,
                            price_spend: res.price_spend ?? 0,
                            date: res.date
                        }))
                    );
                }
                break;

            case "date":
                if (setters.date) {
                    setters.date(
                        apiData.years.map((res: Years_DB) => ({
                            id: res.id,
                            date: res.year
                        }))
                    );
                }
                break;

            case "resource":
                const resourceData = apiData.resource.filter((items: Resource_DB) => items.project_id == id) || [];
                if (setters.resources) {
                    if (id && id > 0 && resourceData.length > 0) {
                        setters.resources(
                            resourceData.map((res: Resource_DB) => ({
                                id: res.id,
                                name: res.origine_resource ?? '',
                                prix: res.price_resource ?? 0,
                                date: res.created_at
                            }))
                        );
                    } else {
                        const nextId = apiData.resource.length > 0 
                        ? Math.max(...apiData.resource.map((i: Resource_DB) => i.id)) + 1 
                        : 1;
                        setters.resources([
                            {
                                id: nextId,
                                name: '',
                                prix: 0,
                                date: new Date()
                            }
                        ]);
                    }
                }
                break;

            case "spend":
                const spendData = apiData.spend.filter((items: Spend_DB) => items.project_id == id) || [];
                if (setters.spends) {
                    if (id && id > 0 && spendData.length > 0) {
                        setters.spends(
                            spendData.map((sp: Spend_DB) => ({
                                id: sp.id,
                                name: sp.name_spend ?? '',
                            }))
                        );
                    } else{
                        const nextId = apiData.spend.length > 0 
                        ? Math.max(...apiData.spend.map((i: Spend_DB) => i.id)) + 1 
                        : 1;
                        setters.spends([
                            {
                                id: nextId,
                                name: '',
                            }
                        ]);
                    }
                }
                break;
                
            case "detail":
                if (setters.details) {
                    setters.details(
                        apiData.detail.map((dt: Details_DB) => ({
                            id: dt.id,
                            value: dt.name_detail,
                            depense_id: dt.spend_id
                        }))
                    );
                }
                break;

            case "make":
                if (setters.makes) {
                    setters.makes(
                        apiData.make.map((make: Makes_DB) => ({
                            id: make.id,
                            detail_id: make.detail_id,
                            ressource_id: make.resource_id,
                            prix: make.price_spend
                        }))
                    );
                }
                break;

            default:
                break;
        }
    });
}

