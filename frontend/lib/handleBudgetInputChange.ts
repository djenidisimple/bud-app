import { ValueInputs } from "@/types/BudgetTypes";
import { Detail, Fields, FieldSetters, Make, Spend } from "@/types/UtilsTypes";

export const handleBudgetInputChange = (
    apiData: ValueInputs,
    fields: Fields[],
    setters: FieldSetters = {}
) => {
    fields.forEach(field => {
        addData(field, apiData, setters);

        switch (field) {
            case "resource": {
                const dataRes = apiData.resource;
                if (setters.resources && dataRes && dataRes.length > 0) {
                    if (dataRes[0].name !== undefined) {
                        setters.resources(prevRes =>
                            prevRes.map(res =>
                                res.id === dataRes[0].id ? { ...res, name: dataRes[0].name } : res
                            )
                        );
                    } else if (dataRes[0].prix !== undefined) {
                        setters.resources(prevRes =>
                            prevRes.map(res =>
                                res.id === dataRes[0].id ? { ...res, prix: dataRes[0].prix } : res
                            )
                        );
                    }
                    addRessource(setters, apiData);
                }
                break;
            }
            case "spend": {
                const dataSpend = apiData.spend;
                if (setters.spends && dataSpend && dataSpend.length > 0) {
                    setters.spends(prevSpend =>
                        prevSpend.map(spend =>
                            spend.id === dataSpend[0].id ?
                                { ...spend, name: dataSpend[0].name } : spend
                        )
                    );
                }
                break;
            }
            case "detail": {
                const dataExterne = apiData.detail;
                if (setters.details && dataExterne && dataExterne.length > 0) {
                    setters.details(prevDetails =>
                        prevDetails.map(detail =>
                            detail.id === dataExterne[0].id
                                ? { ...detail, value: dataExterne[0].value }
                                : detail
                        )
                    );
                }
                break;
            }
            case "make": {
                const dataMake = apiData.make;
                // Décommenter et adapter si besoin
                // if (setters.makes && dataMake && dataMake.length > 0) {
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
            }
            default:
                break;
        }
    });
};

export const addData = (
    field: Fields,
    apiData: ValueInputs,
    setters: FieldSetters = {}
) => {
    switch (field) {
        case "spend": {
            const spendsData = apiData.spend;
            if (setters.data && spendsData) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(spendsData.map(res => res.id));
                    return {
                        ...prev,
                        depense: [
                            ...prev.depense.filter(res => !newIdsSet.has(res.id)),
                            ...spendsData.map((sp: Spend) => ({
                                id: sp.id,
                                name: sp.name ?? '',
                            }))
                        ]
                    };
                });
            }
            break;
        }
        case "detail": {
            const detailsData = apiData.detail;
            if (setters.data && detailsData) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(detailsData.map(res => res.id));
                    return {
                        ...prev,
                        detail: [
                            ...prev.detail.filter(res => !newIdsSet.has(res.id)),
                            ...detailsData.map((dt: Detail) => ({
                                id: dt.id,
                                value: dt.value,
                                depense_id: dt.depense_id
                            }))
                        ]
                    };
                });
            }
            break;
        }
        case "make": {
            const makesData = apiData.make;
            if (setters.data && makesData && makesData.length > 0) {
                if (makesData[0].stayResource && makesData[0].stayResource.length > 0) {
                    const stayResource = makesData[0].stayResource.find(item => item.id === makesData[0].ressource_id);
                    if (stayResource) {
                        const stay = stayResource.price - makesData[0].prix;
                        if (stay >= 0) {
                            setters.data(prev => {
                                if (!prev) return prev;
                                const newIdsSet = new Set(makesData.map(res => res.id));
                                return {
                                    ...prev,
                                    make: [
                                        ...prev.make.filter(res => !newIdsSet.has(res.id)),
                                        ...makesData.map((make: Make) => ({
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
            }
            break;
        }
        default:
            break;
    }
};

export const addDataBase = (
    field: Fields,
    apiData: ValueInputs,
    setters: FieldSetters = {}
) => {
    switch (field) {
        case "resource": {
            const resourcesData = apiData.resource;
            if (setters.data && resourcesData) {
                setters.data((prev: any) => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(resourcesData.map(res => res.id));
                    return {
                        ...prev,
                        ressource: [
                            ...prev.ressource.filter(res => !newIdsSet.has(res.id)),
                            ...resourcesData.map((sp: any) => ({
                                id: sp.id,
                                name: sp.origine_resource ?? '',
                                prix: sp.price_resource ?? '',
                            }))
                        ]
                    };
                });
            }
            break;
        }
        case "spend": {
            const spendsData = apiData.spend;
            if (setters.data && spendsData) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(spendsData.map(res => res.id));
                    return {
                        ...prev,
                        depense: [
                            ...prev.depense.filter(res => !newIdsSet.has(res.id)),
                            ...spendsData.map((sp: any) => ({
                                id: sp.id,
                                name: sp.name_spend ?? '',
                            }))
                        ]
                    };
                });
            }
            break;
        }
        case "detail": {
            const detailsData = apiData.detail;
            if (setters.data && detailsData) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(detailsData.map(res => res.id));
                    return {
                        ...prev,
                        detail: [
                            ...prev.detail.filter(res => !newIdsSet.has(res.id)),
                            ...detailsData.map((dt: any) => ({
                                id: dt.id,
                                value: dt.name_detail,
                                depense_id: dt.spend_id
                            }))
                        ]
                    };
                });
            }
            break;
        }
        case "make": {
            const makesData = apiData.make;
            if (setters.data && makesData) {
                setters.data(prev => {
                    if (!prev) return prev;
                    const newIdsSet = new Set(makesData.map(res => res.id));
                    return {
                        ...prev,
                        make: [
                            ...prev.make.filter(res => !newIdsSet.has(res.id)),
                            ...makesData.map((make: any) => ({
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
        }
        default:
            break;
    }
};

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
};