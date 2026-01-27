import { ValueInputs } from "@/types/BudgetTypes";
import { Detail, Fields, FieldSetters, Make, Spend } from "@/types/UtilsTypes";


export const handleBudgetInputChange = (
    apiData: ValueInputs,
    fields: Fields[], // can to be resource, spend, make, detail,
    setters: FieldSetters = {}
) => {
    fields.forEach(field => {
        
        addData(field, apiData, setters)
        
        switch (field) {
            case "resource":
                const dataRes = apiData.resource;
                if (setters.resources && dataRes) {
                    if (dataRes[0].name) {
                        setters.resources(prevRes =>
                            prevRes.map(res =>
                                res.id === dataRes[0].id ? { ...res, name: dataRes[0].name } : res
                            )
                        );
                    } else if (dataRes[0].prix) {
                        setters.resources(prevRes =>
                            prevRes.map(res =>
                                res.id === dataRes[0].id ? { ...res, prix: dataRes[0].prix } : res
                            )
                        );
                    }
                    addRessource(setters, apiData)
                    
                }
                break;
                
                case "spend":
                    const dataSpend = apiData.spend;
                    if (setters.spends && dataSpend) {
                        setters.spends(prevSpend =>
                            prevSpend.map(spend =>
                                spend.id === dataSpend[0].id ?
                                { ...spend, name: dataSpend[0].name } : spend
                            )
                        );
                    }
                break;
                
            case "detail":
                const dataExterne = apiData.detail;
                if (setters.details && dataExterne) {
                    setters.details(prevDetails => 
                        prevDetails.map(detail => 
                        detail.id === dataExterne[0].id 
                            ? { ...detail, value: dataExterne[0].value }
                            : detail
                        )
                    );
                }

                break;

            case "make":
                const dataMake = apiData.make;
                //  if (setters.makes && dataMake && dataMake.length > 0) {
                //     if (dataMake[0].stay && dataMake[0].stay <= 0) {
                //         alert(`Attention, le prix de la ressource est insuffisant.`);
                //     } else {
                //         if (setters.setSave) {
                //             setters.setSave(dataMake[0].stay ?? 0);
                //         }
                //         setters.makes(prevMakes =>
                //             prevMakes.map(make =>
                //                 make.id === dataMake[0].id ?
                //                 { ...make, prix: dataMake[0].prix } : make
                //             )
                //         );
                //     }
                // }
                break;
            default:
                break;
        }
    });
}

export const addData = (
    field: Fields,
    apiData: ValueInputs,
    setters: FieldSetters = {}
) => {
    switch (field) {

        case "spend":
            const spends = apiData.spend;
            if (setters.data && spends) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(spends.map(res => res.id)); 
                    return {
                        ...prev,
                        depense: [
                            ...prev.depense.filter(res => !newIdsSet.has(res.id)), // Garde les ressources existantes
                            ...spends.map((sp: Spend) => ({
                                id: sp.id,
                                name: sp.name ?? '',
                            }))
                        ]
                    };
                });
            }
            break;
            
        case "detail":
            const details = apiData.detail;
            if (setters.data && details) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(details.map(res => res.id)); 
                    return {
                        ...prev,
                        detail: [
                            ...prev.detail.filter(res => !newIdsSet.has(res.id)), // Garde les ressources existantes
                            ...details.map((dt: Detail) => ({
                                id: dt.id,
                                value: dt.value,
                                depense_id: dt.depense_id
                            }))
                        ]
                    };
                });
            }
            break;

        case "make":
            const makes = apiData.make;
            if (setters.data && makes) {
                if (makes[0].stayResource && makes[0].stayResource.length > 0) {
                    const stayResource = makes[0].stayResource.filter(item => item.id === makes[0].ressource_id)[0];
                    const stay = stayResource.price - makes[0].prix;
                    if (stay >= 0) {
                        setters.data(prev => {
                            if (!prev) return prev;
                            const newIdsSet = new Set(makes.map(res => res.id)); 
                            return {
                                ...prev,
                                make: [
                                    ...prev.make.filter(res => !newIdsSet.has(res.id)),
                                    ...makes.map((make: Make) => ({
                                        id: make.id,
                                        detail_id: make.detail_id,
                                        ressource_id: make.ressource_id,
                                        prix: make.prix
                                    }))
                                ]
                            };
                        });
                    }
                }
            }
            break;
        default:
            break;
    }
}

export const addDataBase = (
    field: Fields,
    apiData: ValueInputs,
    setters: FieldSetters = {}
) => {
    switch (field) {

        case "resource":
            const resources = apiData.resource;
            if (setters.data && resources) {
                setters.data((prev: any) => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(resources.map(res => res.id)); 
                    return {
                        ...prev,
                        ressource: [
                            ...prev.ressource.filter(res => !newIdsSet.has(res.id)), // Garde les ressources existantes
                            ...resources.map((sp: any) => ({
                                id: sp.id,
                                name: sp.origine_resource ?? '',
                                prix: sp.price_resource ?? '',
                            }))
                        ]
                    };
                });
            }
            break;

        case "spend":
            const spends = apiData.spend;
            if (setters.data && spends) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(spends.map(res => res.id)); 
                    return {
                        ...prev,
                        depense: [
                            ...prev.depense.filter(res => !newIdsSet.has(res.id)), // Garde les ressources existantes
                            ...spends.map((sp: any) => ({
                                id: sp.id,
                                name: sp.name_spend ?? '',
                            }))
                        ]
                    };
                });
            }
            break;
            
        case "detail":
            const details = apiData.detail;
            if (setters.data && details) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(details.map(res => res.id)); 
                    return {
                        ...prev,
                        detail: [
                            ...prev.detail.filter(res => !newIdsSet.has(res.id)), // Garde les ressources existantes
                            ...details.map((dt: any) => ({
                                id: dt.id,
                                value: dt.name_detail,
                                depense_id: dt.spend_id
                            }))
                        ]
                    };
                });
            }
            break;

        case "make":
            const makes = apiData.make;
            // console.table(makes)
            if (setters.data && makes) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(makes.map(res => res.id)); 
                    return {
                        ...prev,
                        make: [
                            ...prev.make.filter(res => !newIdsSet.has(res.id)),
                            ...makes.map((make: any) => ({
                                id: make.id,
                                detail_id: make.detail_id,
                                ressource_id: make.resource_id,
                                prix: make.price_spend
                            }))
                        ]
                    };
                });
            }
            break;
        default:
            break;
    }
}

const addRessource = (
    setters: FieldSetters,
    apiData: ValueInputs
) => {
    const resources = apiData.resource;
    const setData = setters.data;
    const setRes = setters.resources;
    if (setRes && setData && resources && resources.length > 0) {

        setRes(prevRes => {
            const filteredRes = prevRes.filter(value => value.id === resources[0].id);
            
            setData(prevData => {

                if (!prevData) return prevData;
                
                const newIdsSet = new Set(resources.map(res => res.id)); 
                
                return {
                    ...prevData,
                    ressource: [
                        ...prevData.ressource.filter(res => !newIdsSet.has(res.id)),
                        ...filteredRes.map(r => ({
                            id: r.id,
                            name: r.name ?? '',
                            prix: r.prix ?? 0,
                        }))
                    ]
                };
            });
            
            return prevRes;
        });
    }
}