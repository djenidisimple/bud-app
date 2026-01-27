'use client'
import TableBodySpend from "@/components/table-body-spend";
import TableHeadRessource from "@/components/table-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { CalendarDays, CircleDollarSign, CurrencyIcon, PiggyBankIcon, PlusIcon, SaveIcon, TrendingDownIcon, WalletCards, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TableBodyMake from "@/components/table-body-make";
import { handleBudgetInputChange } from "@/lib/handleBudgetInputChange ";
import { Detail, Make, Resource, Spend } from "@/types/UtilsTypes";
import { fetchById } from "@/lib/requestApi";
import { fillData } from "@/lib/fillData";
import { Budget } from "@/types/BudgetTypes";
import { addInputSpend } from "@/components/addInput";
import { axiosInstance } from "@/lib/axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DetailSpend_DB, Projects_DB, StayResource_DB } from "@/types/DataBaseType";
import { PDFExportButton } from "@/components/showPdf";
import { editMoney } from "@/lib/utils";

export default function Logic({
    params
    }: {
        params: { projectId: string }
    }
) {
    const { projectId } = params;

    const [inputsDetail, setInputsDetail] = useState<Detail[]>([]);
    const [inputsMake, setInputsMake] = useState<Make[]>([]);
    const [inputsRes, setInputsRes] = useState<Resource[]>([]);
    const [inputsSpend, setInputsSpend] = useState<Spend[]>([]);
    const [detailSpend, setDetailSpend] = useState<{ id: number; name: string; prix: number; }[]>([]);
    const [stayResource, setStayResource] = useState<{ id: number; name: string | undefined; prix: number; }[]>([]);
    const [totalResource, setTotalResource] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [budget, setBudget] = useState(0);
    const [nameProject, setNameProject] = useState('');

    const [dataAll, setDataAll] = useState<Budget>({
        depense: [],
        ressource: [],
        detail: [],
        make: []
    });

    const [dataPrint, setDataPrint] = useState<Budget>({
        depense: [],
        ressource: [],
        detail: [],
        make: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchById(Number(projectId));
                setNameProject(
                    response.project.filter((proj: Projects_DB) => proj.id === Number(projectId))[0].name_project
                );
                fillData(
                    Number(projectId),
                    response, 
                    [
                        'resource',
                        'spend',
                        'detail',
                        'make',
                    ],
                    {
                        resources: setInputsRes,
                        spends: setInputsSpend,
                        details: setInputsDetail,
                        makes: setInputsMake,
                        data: setDataPrint
                    }
                );
                setTotalResource(response.totalResource);
                setTotalSpend(response.totalSpend);
                setBudget(response.budget);
                setDetailSpend(response.detailSpend.map((detail: DetailSpend_DB) => ({
                    id: detail.id,
                    name: detail.name_detail,
                    prix: detail.price_spend, // Correction ici
                })));
                setStayResource(response.stayResource.map((res: StayResource_DB) => ({
                    id: res.id,
                    name: res.name_resource,
                    prix: res.stay, // Correction ici
                })));
            } catch (error) {
                console.error('Erreur lors de la récupération des donnee:', error);
            }
        };
        fetchData();
    }, [projectId]);

    const showData = async () => {
        const response = await axiosInstance.post(`/api/postData?projectId=${projectId}`, dataAll)
        alert(response.data.message)
    }

    const printData = () => {
        console.table(dataPrint)
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                {/* Boutons d'actions */}
                <div className="flex flex-wrap p-2 bg-gray-100 border-b">
                    <Button 
                        variant="ghost" 
                        className="w-10 m-1 hover:bg-gray-200"
                        onClick={() => showData()}
                    >
                        <SaveIcon className="text-blue-500"/>
                    </Button>
                    <PDFExportButton budgetData={dataPrint} />
                    <Button 
                        variant="ghost"
                        className="w-10 m-1 hover:bg-gray-200"
                        onClick={() => addInputSpend(setInputsSpend, inputsSpend)}
                    >
                        <PlusIcon 
                            className="text-green-500"
                        />
                    </Button>
                </div>

                {/* Conteneur principal avec défilement */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3 m-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <WalletCards className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                        Gestion budgétaire
                        </h1>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 m-2 p-2">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Projet <span className="font-bold text-indigo-600">{nameProject}</span>
                            </h2>
                            <p className="text-gray-600 mt-1 max-w-xl text-sm">
                                Suivi financier complet : allocation des ressources, contrôle des dépenses et optimisation du budget
                            </p>
                        </div>
                            
                        <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <CalendarDays className="inline mr-1 h-4 w-4" /> 
                            {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <CircleDollarSign className="inline mr-1 h-4 w-4" /> 
                            Budget actif
                        </span>
                        </div>
                    </div>
                    <div className="mt-4 h-[4px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                </div>
                <div className="flex-1 overflow-x-auto min-w-[800px] m-2 pb-24 pl-4">
                    <Table className="min-w-full">
                        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                            <TableRow className="hover:bg-inherit">
                                <TableHead className="min-w-[50px] text-center border-0">No</TableHead>
                                <TableHead className="min-w-[200px] text-center">Dépense</TableHead>
                                <TableHead className="min-w-[250px] text-center">
                                    Motif
                                </TableHead>
                                <TableHeadRessource
                                    inputsRes={inputsRes}
                                    setInputsRes={setInputsRes}
                                    setDataAll={setDataAll}
                                />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inputsSpend.map((spend, index) => (
                                <TableRow key={`spend-${spend.id}`}>
                                    <TableCell className="border-2 text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border-2 p-0 w-50">
                                        <div className="flex justify-center items-center">
                                            <Input
                                                type="text"
                                                className="w-full border-2 rounded-none"
                                                value={spend.name}
                                                onChange={(e) => handleBudgetInputChange(
                                                    { spend: [{ id: spend.id, name: e.target.value }] },
                                                    ['spend'],
                                                    { spends: setInputsSpend, data: setDataAll }
                                                )}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="border-2 p-0">
                                        <div className="flex justify-center w-full flex-wrap items-center">
                                            <TableBodySpend
                                                depense_id={spend.id}
                                                nameSpend={spend.name}
                                                inputsDetail={inputsDetail}
                                                setDataAll={setDataAll}
                                                setInputsDetail={setInputsDetail}
                                            />
                                        </div>
                                    </TableCell>
                                    {inputsRes.map((res) => (
                                        <TableBodyMake
                                            key={`make-${spend.id}-${res.id}`}
                                            totalRes = {inputsRes.reduce((sum, res) => sum + Number(res.prix || 0), 0)}
                                            resouurceId={res.id}
                                            spendId={spend.id}
                                            inputsRes={inputsRes}
                                            inputsDetail={inputsDetail}
                                            inputsMake={inputsMake} 
                                            setInputsMake={setInputsMake}
                                            setDataAll={setDataAll}
                                            stayResource={stayResource}
                                            setStayResource={setStayResource}
                                            setDetailSpend={setDetailSpend}
                                        />
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Footer fixe en bas */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center px-5 shadow-lg">
                    <div className="flex flex-1 justify-between items-center max-w-6xl mx-auto">
                        <div className="grid grid-cols-3 gap-6 w-full">
                        {/* Budget Initial */}
                        <div className="flex items-center">
                            <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <WalletIcon className="
                                            h-5 w-5 text-blue-600
                                            " 
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="
                                        bg-white rounded-md 
                                        shadow-lg border 
                                        border-gray-200 p-4 
                                        min-w-[280px]"
                                    >
                                        <div className="mb-3 pb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <WalletIcon className="h-5 w-5 text-indigo-600" />
                                                <h3 className="text-lg font-semibold text-gray-800">Liste des ressources</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Budget initial: {editMoney(totalResource, ',')} Ar
                                            </p>
                                        </div>

                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {inputsRes.map((res) => (
                                            <li 
                                                key={`${res.id}-id`} 
                                                className="
                                                    flex items-center 
                                                    justify-between p-2 
                                                    rounded-lg 
                                                    hover:bg-gray-50 
                                                    transition-colors
                                                "
                                            >
                                                <div className="flex items-center">
                                                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                                    <CurrencyIcon className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">{res.name}</span>
                                                </div>
                                                <span className="bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-md text-sm">
                                                {editMoney(res.prix ?? 0, ',')} Ar
                                                </span>
                                            </li>
                                            ))}
                                        </ul>

                                        <div className="
                                            mt-3 pt-3 
                                            border-t border-gray-100 
                                            flex justify-between 
                                            items-center
                                            "
                                        >
                                            <span className="
                                                text-sm font-medium 
                                                text-gray-700
                                            "
                                            >
                                                Total
                                            </span>
                                            <span className="
                                                text-lg font-bold 
                                                text-indigo-700
                                                "
                                            >
                                                {editMoney(inputsRes.reduce((sum, res) => sum + Number(res.prix || 0), 0), ',')} Ar
                                            </span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Budget Initial</p>
                                <p className="text-base font-bold text-blue-700">{editMoney(inputsRes.reduce((sum, res) => sum + Number(res.prix || 0), 0), ',')} Ar</p>
                            </div>
                        </div>

                        {/* Dépenses */}
                        <div className="flex items-center">
                            <div className="mr-3 bg-red-100 p-2 rounded-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <TrendingDownIcon className="
                                                h-5 w-5 text-red-600
                                            " 
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="
                                        bg-white rounded-md 
                                        shadow-lg border 
                                        border-gray-200 p-4 
                                        min-w-[280px]"
                                    >
                                        <div className="mb-3 pb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <TrendingDownIcon className="
                                                        h-5 w-5 text-red-600
                                                    " 
                                                />
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Liste des dépenses
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Total Dépenses : {editMoney(totalSpend, ',')} Ar
                                            </p>
                                        </div>

                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {detailSpend.map((spend) => (
                                            <li 
                                                key={`${spend.id}-id`} 
                                                className="
                                                    flex items-center 
                                                    justify-between p-2 
                                                    rounded-lg 
                                                    hover:bg-gray-50 
                                                    transition-colors
                                                "
                                            >
                                                <div className="flex items-center">
                                                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                                    <CurrencyIcon className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    {spend.name}
                                                </span>
                                                </div>
                                                <span className="
                                                    bg-blue-50 text-red-700 
                                                    font-medium px-2 py-1 
                                                    rounded-md text-sm"
                                                >
                                                {editMoney(spend.prix, ',')} Ar
                                                </span>
                                            </li>
                                            ))}
                                        </ul>

                                        <div className="
                                                mt-3 pt-3 
                                                border-t border-gray-100 
                                                flex justify-between 
                                                items-center
                                            "
                                        >
                                            <span className="
                                                text-sm font-medium 
                                                text-gray-700
                                            "
                                            >
                                                Total
                                            </span>
                                            <span className="
                                                text-lg font-bold 
                                                text-red-700
                                                "
                                            >
                                                {editMoney(detailSpend.reduce((sum, res) => sum + Number(res.prix || 0), 0), ',')} Ar
                                            </span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Total Dépenses</p>
                                <p className="text-base font-bold text-red-600">{editMoney(detailSpend.reduce((sum, res) => sum + Number(res.prix || 0), 0), ',')} Ar</p>
                            </div>
                        </div>

                        {/* Reste */}
                        <div className="flex items-center">
                            <div className="mr-3 bg-green-100 p-2 rounded-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <PiggyBankIcon 
                                            className="
                                            h-5 w-5 
                                            text-green-600
                                            " 
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="
                                        bg-white rounded-md 
                                        shadow-lg border 
                                        border-gray-200 p-4 
                                        min-w-[280px]"
                                    >
                                        <div className="mb-3 pb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <PiggyBankIcon 
                                                    className="
                                                        h-5 w-5 
                                                        text-green-600
                                                    " 
                                                />
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Budget
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Budget Restant : {editMoney(budget, ',')} Ar
                                            </p>
                                        </div>
                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {stayResource.map((stay) => (
                                            <li 
                                                key={`${stay.id}-Stay-id`} 
                                                className="
                                                    flex items-center 
                                                    justify-between p-2 
                                                    rounded-lg 
                                                    hover:bg-gray-50 
                                                    transition-colors
                                                "
                                            >
                                                <div className="flex items-center">
                                                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                                    <CurrencyIcon className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    {stay.name}
                                                </span>
                                                </div>
                                                <span className="
                                                    bg-blue-50 text-green-700 
                                                    font-medium px-2 py-1 
                                                    rounded-md text-sm"
                                                >
                                                {editMoney(stay.prix, ',')} Ar
                                                </span>
                                            </li>
                                            ))}
                                        </ul>
                                        <div className="
                                                mt-3 pt-3 
                                                border-t border-gray-100 
                                                flex justify-between 
                                                items-center
                                            "
                                        >

                                            <span className="
                                                text-sm font-medium 
                                                text-gray-700
                                            "
                                            >
                                                Total
                                            </span>
                                            <span className="
                                                text-lg font-bold 
                                                text-green-700
                                                "
                                            >
                                                {editMoney(budget, ',')} Ar
                                            </span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div>
                            <p className="text-xs text-gray-500 font-medium">Budget Restant</p>
                            <p className="text-base font-bold text-green-700">{editMoney(stayResource.reduce((sum, res) => sum + Number(res.prix || 0), 0), ',')} Ar</p>
                            </div>
                        </div>
                        </div>

                        {/* Barre de progression */}
                        <div className="w-64 ml-6">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500" 
                                style={{ 
                                    width: `${(totalSpend / totalResource) * 100}%` 
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                            {Math.round( (totalResource > 0 ? (totalSpend / totalResource) : 0) * 100)}% du budget utilisé
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}