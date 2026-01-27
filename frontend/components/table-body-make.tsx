import { TableCell } from "./ui/table";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { addInputMake } from "./addInput";
import TableBodyMake2 from "./table-body-make2";
import { Detail, Make, Resource } from "@/types/UtilsTypes";
import { Budget } from "@/types/BudgetTypes";
import { calculateRemainingResources, remplirStayResource } from "@/lib/utils";

type TableHeadMakeProps = {
    resouurceId: number;
    totalRes: number,
    spendId: number;
    inputsRes: Resource[];
    inputsDetail: Detail[];
    inputsMake: Make[];
    setInputsMake: React.Dispatch<React.SetStateAction<Make[]>>
    setDataAll: React.Dispatch<React.SetStateAction<Budget>>;
    stayResource: { id: number;name: string | undefined;prix: number; }[];
    setStayResource?: React.Dispatch<React.SetStateAction<{ id: number; name: string | undefined; prix: number; }[]>>;
    setDetailSpend?: React.Dispatch<React.SetStateAction<{ id: number;name: string;prix: number; }[]>>;
};

export default function TableBodyMake(
    { 
        resouurceId,
        totalRes,
        spendId,
        inputsRes,
        inputsDetail,
        inputsMake, 
        setInputsMake, 
        setDataAll,
        stayResource,
        setStayResource,
        setDetailSpend
    }: TableHeadMakeProps) 
    {
    return (
    <>
        <TableCell key={`resource-${resouurceId}`} className="border-2 p-0">
            {/* ressource */}
            <div className="
                flex 
                justify-center 
                w-full flex-wrap
                items-center
            ">
                {inputsMake.filter(items => items.ressource_id === resouurceId).map((input) => (
                    <TableBodyMake2
                        inputsRes={inputsRes}
                        inputsMakes={inputsMake}
                        key={`makes-${input.id}-Makes`}
                        detailId={input.detail_id}
                        makeId={input.id}
                        inputsDetail={inputsDetail}
                        ressource_id={input.ressource_id}
                        depense_id={spendId}
                        prix={input.prix}
                        setInputsMake={setInputsMake}
                        setDataAll={setDataAll}
                        stayResource={stayResource}
                        setStayResource={setStayResource}
                        setDetailSpend={setDetailSpend}
                    />
                    
                ))}
                <Button
                    variant={"outline"}
                    className="w-full rounded-none"
                    onClick={
                        () => { 
                            addInputMake(
                                setInputsMake, 
                                setDataAll, 
                                inputsMake, 
                                inputsDetail, 
                                resouurceId,
                                calculateRemainingResources(inputsMake, totalRes)
                            );
                            // console.table(stayResource.filter(item => item.id === resouurceId)[0].price)
                        }
                    }
                >
                    <PlusIcon />
                </Button>
            </div>
        </TableCell>
    </>
  );
}