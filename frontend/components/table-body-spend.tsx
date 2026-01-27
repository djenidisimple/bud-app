import { Input } from "@/components/ui/input";
import { Detail, Spend } from "@/types/UtilsTypes";
import { PlusIcon } from "lucide-react";
import { addInputDetail } from "./addInput";
import { Button } from "./ui/button";
import { handleBudgetInputChange } from "@/lib/handleBudgetInputChange ";
import { Budget } from "@/types/BudgetTypes";

type TableBodySpendProps = {
  depense_id: number;
  inputsDetail: Detail[];
  nameSpend: String;
  setDataAll: React.Dispatch<React.SetStateAction<Budget>>;
  setInputsDetail: React.Dispatch<React.SetStateAction<Detail[]>>;
};

export default function TableBodySpend({ depense_id, inputsDetail, nameSpend, setDataAll, setInputsDetail }: TableBodySpendProps) {
    
  return (
    <>
        {
            inputsDetail.filter((items) => items.depense_id === depense_id).map((input) => (
                <Input
                    key={ `detail-${input.id}` }
                    type="text"
                    className="w-full border-2 rounded-none"
                    value={input.value}
                    onChange={e => {
                        handleBudgetInputChange(
                            {
                                detail: [
                                    {
                                        id: input.id,
                                        value: e.target.value,
                                        depense_id: input.depense_id
                                    }
                                ]
                            },
                            [
                                "detail"
                            ],
                            {
                                details: setInputsDetail,
                                data: setDataAll
                            }
                        );
                    }}
                />
            ))
        }
        <Button
            variant={"outline"}
            className="w-full rounded-none"
            onClick={
                () => {
                    addInputDetail(setInputsDetail, setDataAll, nameSpend, inputsDetail, depense_id);
                }
            }
        >
            <PlusIcon/>
        </Button>
    </>
  );
}