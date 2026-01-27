import { Input } from "@/components/ui/input";
import { TableHead } from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import { addInputResource } from "./addInput";
import { Button } from "./ui/button";
import { handleBudgetInputChange } from "@/lib/handleBudgetInputChange ";
import { Resource } from "@/types/UtilsTypes";
import { Budget } from "@/types/BudgetTypes";

type TableHeadRessourceProps = {
  inputsRes: Resource[];
  setInputsRes: React.Dispatch<React.SetStateAction<Resource[]>>;
  setDataAll: React.Dispatch<React.SetStateAction<Budget>>;
};

export default function TableHeadRessource({ inputsRes, setInputsRes, setDataAll }: TableHeadRessourceProps) {

  return (
    <>
      {inputsRes.map((input) => (
        <TableHead key={input.id} className="border-2 text-center p-0 min-w-[220px]">
          <Input
              type="text"
              value={input.name ?? ''}
              className="border-2 rounded-none"
              onChange={e => {
                handleBudgetInputChange(
                  {
                    resource: [
                      {  
                        id: input.id,
                        name: e.target.value
                      },
                    ]
                  },
                  ['resource'],
                  {
                    resources: setInputsRes,
                    data: setDataAll
                  }
                )
              }}
          />
          <Input
              key={ input.id+"x" }
              type="number"
              value={input.prix ?? ''}
              className="border-2 rounded-none"
              onChange={e => {
                  handleBudgetInputChange(
                    {
                      resource: [
                        {  
                          id: input.id,
                          prix: Number(e.target.value)
                        },
                      ]
                    },
                    ['resource'],
                    {
                      resources: setInputsRes,
                      data: setDataAll
                    }
                  )
              }}
          />
        </TableHead>
      ))}
      <TableHead>
          <Button 
              variant={"outline"}
              className="w-full rounded-none"
              onClick={() => addInputResource(setInputsRes, inputsRes)}
          >
              <PlusIcon/>
          </Button>
      </TableHead>
    </>
  );
}