import { Input } from "@/components/ui/input";
import { handleBudgetInputChange } from "@/lib/handleBudgetInputChange ";
import { remplirStayResource } from "@/lib/utils";
import { Budget } from "@/types/BudgetTypes";
import { Detail, Make, Resource } from "@/types/UtilsTypes";
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

type TableHeadMakeProps = {
  inputsRes: Resource[];
  inputsMakes: Make[];
  detailId: number;
  makeId: number;
  inputsDetail: Detail[];
  ressource_id: number;
  depense_id: number;
  prix: number;
  setInputsMake: Dispatch<SetStateAction<Make[]>>;
  setDataAll: Dispatch<SetStateAction<Budget>>;
  stayResource: { id: number; name: string | undefined; prix: number }[];
  setStayResource?: Dispatch<
    SetStateAction<{ id: number; name: string | undefined; prix: number }[]>
  >;
  setDetailSpend?: Dispatch<SetStateAction<{ id: number; name: string; prix: number; }[]>>;
};

export default function TableBodyMake2({
  inputsRes,
  inputsMakes,
  detailId,
  makeId,
  inputsDetail,
  ressource_id,
  depense_id,
  prix,
  setInputsMake,
  setDataAll,
  stayResource,
  setStayResource,
  setDetailSpend,
}: TableHeadMakeProps) {
  const [inputValue, setInputValue] = useState(prix);

  useEffect(() => {
    setInputValue(prix);
  }, [prix]);

  // Cet effet gère toutes les mises à jour d'état qui dépendent de `inputsMakes`.
  useEffect(() => {
    // 1. Mise à jour de `stayResource`
    if (setStayResource) {
      remplirStayResource(inputsRes, inputsMakes, setStayResource);
    }
    
    // 2. Mise à jour de `detailSpend`
    if (setDetailSpend) {
      setDetailSpend((prevDetailSpend) => {
        const detailName = inputsDetail.find(d => d.id === detailId)?.value || "";
        
        const existingItem = prevDetailSpend.find(item => item.id === makeId);

        if (existingItem) {
          return prevDetailSpend.map(item => 
            item.id === makeId ? { ...item, prix: inputValue } : item
          );
        } else if (inputValue > 0) {
          // Si l'élément est nouveau et le prix est > 0, ajoutez-le.
          const newItem = {
            id: makeId,
            name: detailName,
            prix: inputValue,
          };
          return [...prevDetailSpend, newItem];
        }
        // Si le prix est 0 et que l'élément n'existe pas, ne faites rien.
        return prevDetailSpend;
      });
    }
    
    // 3. Mise à jour du budget global
    handleBudgetInputChange(
      {
        make: inputsMakes,
      },
      ["make"],
      {
        makes: setInputsMake,
        data: setDataAll,
        setSave: () => {},
      }
    );
    
  }, [inputsMakes, inputsRes, setStayResource, setDataAll, setInputsMake, setDetailSpend, detailId, inputsDetail, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrix = Number(e.target.value);
    setInputValue(newPrix);
    updateInputsMake(newPrix);
  };

  const updateInputsMake = (newPrix: number) => {
    setInputsMake((prevMakes) => {
      const existingMake = prevMakes.find(
        (m) => m.id === makeId && m.detail_id === detailId
      );

      let updatedMakes;
      if (existingMake) {
        updatedMakes = prevMakes.map(m =>
          m.id === makeId && m.detail_id === detailId
            ? { ...m, prix: newPrix, stayResource: stayResource }
            : m
        );
      } else if (newPrix > 0) {
        const newMake = {
          id: makeId,
          detail_id: detailId,
          prix: newPrix,
          ressource_id: ressource_id,
          stayResource: stayResource,
        };
        updatedMakes = [...prevMakes, newMake];
      } else {
        updatedMakes = prevMakes;
      }

      // Synchronise le budget global avec la nouvelle liste de makes
      setDataAll(prevBudget => ({
        ...prevBudget,
        make: updatedMakes,
      }));

      return updatedMakes;
    });
  };

  console.table(inputsMakes);

  return (
    <>
      <Input
        key={`make-${makeId}-detail-${detailId}`}
        type="number"
        className="w-full border-2 rounded-none"
        value={inputValue}
        onChange={handleInputChange}
      />
    </>
  );
}