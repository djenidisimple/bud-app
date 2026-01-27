"use client"
import { ChartAreaInteractive } from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { fetchDataAll } from "@/lib/requestApi";
import { editMoney } from "@/lib/utils";
import { Coins, FolderKanbanIcon, HandCoins, WalletCards } from 'lucide-react';
import { useEffect, useState } from "react";

export default function Page() {
  const [project, setProject] = useState(0);
  const [budget, setBudget] = useState(0);
  const [resource, setResource] = useState(0);
  const [spend, setSpend] = useState(0);
  const { user } = useAuth()
      useEffect(() => {
        const fetchData = async () => {
            const response = await fetchDataAll();
            setProject(response.project ?? 0);
            setResource(response.resource[0].price ?? 0)
            setSpend(response.spend[0].price_spend ?? 0)
            setBudget(response.budget ?? 0);
        };
        fetchData();
  }, []);

  return (
      <>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold m-2 mb-5">
              Bienvenu dans BudMan, {user?.name}
          </h1>
          <div className="mt-4 mb-5 h-[4px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          {/* Section des KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Carte Projets */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-start pb-3">
                <CardTitle className="text-base font-medium text-gray-600">Projets Créés</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderKanbanIcon className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{editMoney(project, ',')}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nombre de projets créés
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-start pb-3">
                <CardTitle className="text-base font-medium text-gray-600">Budget Restant</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <WalletCards className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">
                  {editMoney(budget, ',')} Ar
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Solde disponible actuel
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-start pb-3">
                <CardTitle className="text-base font-medium text-gray-600">Ressources</CardTitle>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Coins className="w-5 h-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{editMoney(resource, ',')} Ar</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Budget alloué aux ressources
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-start pb-3">
                  <CardTitle className="text-base font-medium text-gray-600">Dépenses</CardTitle>
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <HandCoins className="w-5 h-5 text-rose-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{editMoney(spend, ',')} Ar</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total des dépenses engagées
                  </p>
                </CardContent>
            </Card>
          </div>

          <div className="bg-white border rounded-md shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Évolution Budgétaire</h2>
              </div>
              <div className="h-full">
                  <ChartAreaInteractive />
              </div>
          </div>
        </div>
      </>
  )
}
