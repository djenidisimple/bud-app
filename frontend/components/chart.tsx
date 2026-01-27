"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { PrinterCheckIcon } from "lucide-react"
import { fetchDataAll } from "@/lib/requestApi"
import { fillData } from "@/lib/fillData"
import { useEffect, useState } from "react"
import { ChartData, ItemsDate } from "@/types/UtilsTypes"
import { fetchDataByMonthsYears } from "@/lib/requestApi"
import { Budget } from "@/types/BudgetTypes"
import { PDFExportButton } from "./showPdf"
// import { PDFExportButton } from "@/components/showPdf";

export const description = "An interactive area chart"

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    price_resource: {
      label: "Ressource obtenu",
      color: "var(--chart-1)",
    },
    price_spend: {
      label: "Dépense",
      color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const [spend, setSpend] = useState<ChartData[]>();
    const [dateRange, setDateRange] = useState<ItemsDate[]>()
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const frenchMonths = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", "Tous"
    ];

    const [dataPrint, setDataPrint] = useState<Budget>({
                depense: [],
                ressource: [],
                detail: [],
                make: []
    });

    const filteredData = spend ? spend.filter((item : ChartData) => {
        if (!item.date || !item.price_resource || !item.price_spend || selectedMonth === null) return false;
    
        const date = new Date(item.date);
        if (selectedMonth === 12) return date.getFullYear() === selectedYear;
        return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    }) : undefined
    
    useEffect(() => {
  const fetchData = async () => {
    try {
      const response3 = await fetchDataByMonthsYears(frenchMonths[selectedMonth], selectedYear);
      fillData(
        0,
        response3, 
        [
          'resource',
          'spend',
          'detail',
          'make',
        ],
        {
          data: setDataPrint
        }
      );
      const response = await fetchDataAll();
      fillData(
        0,
        response,
        [
          'depense',
          'date'
        ],
        {
          depense: setSpend,
          date: setDateRange
        }
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des donnee:', error);
    }
  };
  fetchData();
}, [selectedMonth, selectedYear]);

    // Filtrer les données à exporter selon le mois et l'année sélectionnés
const filteredDataPrint = {
  ...dataPrint,
  depense: Array.isArray(dataPrint.depense)
    ? dataPrint.depense.filter((item: any) => {
        if (!item.date || selectedMonth === null) return false;
        const dateObj = new Date(item.date);
        if (isNaN(dateObj.getTime())) return false; // Ignore invalid dates
        if (selectedMonth === 12) return dateObj.getFullYear() === selectedYear;
        return (
          dateObj.getFullYear() === selectedYear &&
          dateObj.getMonth() === selectedMonth
        );
      })
    : [],
  ressource: Array.isArray(dataPrint.ressource)
    ? dataPrint.ressource.filter((item: any) => {
        if (!item.date || selectedMonth === null) return false;
        const dateObj = new Date(item.date);
        if (isNaN(dateObj.getTime())) return false;
        if (selectedMonth === 12) return dateObj.getFullYear() === selectedYear;
        return (
          dateObj.getFullYear() === selectedYear &&
          dateObj.getMonth() === selectedMonth
        );
      })
    : [],
  detail: dataPrint.detail,
  make: dataPrint.make,
};

    return (
      <Card className="pt-0 rounded-md">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>La variation des dépenses et des ressources</CardTitle>
            <CardDescription>
              L&apos;affichage des dépenses mensuelles
            </CardDescription>
          </div>
          <Select 
            value={selectedMonth !== null ? selectedMonth.toString() : ""}
            onValueChange={(value) => setSelectedMonth(value ? parseInt(value) : new Date().getMonth())}
          >
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Janvier" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                  {frenchMonths.map((month, index) =>
                    <SelectItem key={`${month}-${index}`} value={index.toString()} className="rounded-lg">
                        {month}
                    </SelectItem>
                  )}
              </SelectContent>
          </Select>
          <Select 
            value={selectedYear + ""} 
            onValueChange={(value) => setSelectedYear(value ? parseInt(value) : new Date().getFullYear())} 
          >
              <SelectTrigger
                  className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                  aria-label="Select a value"
              >
                <SelectValue placeholder={selectedYear} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {
                  dateRange ? dateRange.map((date: ItemsDate) => 
                      <SelectItem key={`${date.id}-y`} value={date.date} className="rounded-lg">
                          {date.date}
                      </SelectItem>
                  ) :
                  selectedYear
                }
              </SelectContent>
          </Select>
          <PDFExportButton 
            budgetData={filteredDataPrint}
            title={`Rapport Budgetaire (${selectedMonth !== 12 ? frenchMonths[selectedMonth] : ''} ${selectedYear})`}
          />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                  dataKey="price_spend"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-price_spend)"
                  stackId="a"
              />
              <Area
                  dataKey="price_resource"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-price_resource)"
                  stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
}
