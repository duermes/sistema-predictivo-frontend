"use client";
import { useState } from "react";
import { FileDown, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/app/components/dashboard/select";

import { Checkbox } from "@/app/components/dashboard/checkbox";
import { Card } from "@/components/ui/card";
import { PredictionChart } from "@/app/components/dashboard/prediction-chart";
import { DataTable } from "./data-table";
import { MonthRangeDropdown } from "./month-range-dropdown";
import { MonthRange } from "./month-range-picker";

const productTypeOptions: SelectOption[] = [
  { value: "I", label: "Insumo" },
  { value: "M", label: "Medicamento" },
];

// medEST en mproducto es el tipo de estrategia
const demandSupportOptions: SelectOption[] = [
  { value: "_", label: "Demanda" },
  { value: "S", label: "Soporte" },
  { value: "E", label: "Estrategia" },
];

const timeOptions: SelectOption[] = [
  { value: "trimestral", label: "Trimestral" },
];

const formatToYYYYMM = (date: Date) => {
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
};

export function PredictiveSystem() {
  const [productType, setProductType] = useState<string>("");
  const [demandSupport, setDemandSupport] = useState<string>("");
  const [monthRange, setMonthRange] = useState<MonthRange>({
    from: null,
    to: null,
  });
  const [realTime, setRealTime] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(false);

  // esta funcion puede que la deje de usar, borrar cuando loading y setLoading funcionen
  const handlePredict = () => {
    console.log(monthRange);
    // if (!productType || !demandSupport || !monthRange.from || !monthRange.to) {
    //   alert("Por favor, complete todos los campos requeridos");
    //   return;
    // }

    setShowChart(true);
    // console.log({
    //   productType,
    //   demandSupport,
    //   monthRange,
    //   realTime,
    //   startDate,
    //   endDate,
    // });
  };

  const getProducts = async () => {
    setLoading(true);
    if (!productType || !demandSupport || !monthRange.from || !monthRange.to) {
      alert("Por favor, complete todos los campos requeridos");
      setLoading(false);
      return;
    }
    const startDate = formatToYYYYMM(monthRange.from);
    const endDate = formatToYYYYMM(monthRange.to);

    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      product_type: productType,
      strategy: demandSupport,
    });

    await fetch(`${process.env.API_URL}/api/data/summary?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-2 rounded-md">
          <Select
            options={productTypeOptions}
            value={productType}
            onValueChange={setProductType}
            placeholder="Tipo de Producto"
          />
        </div>

        <div className="bg-gray-100 p-2 rounded-md">
          <Select
            options={demandSupportOptions}
            value={demandSupport}
            onValueChange={setDemandSupport}
            placeholder="Demanda / Soporte"
          />
        </div>

        <div className="bg-gray-100 p-2 rounded-md">
          <Select
            options={timeOptions}
            value=""
            onValueChange={() => {}}
            placeholder="Trimestral"
            disabled
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-0">
            <div className="bg-gray-800 text-white p-2 text-center">Inicio</div>
            <div className="bg-gray-800 text-white p-2 text-center">
              Término
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-b-md">
            <MonthRangeDropdown
              monthRange={monthRange}
              setMonthRange={setMonthRange}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span>Tiempo Real</span>
          <Checkbox
            checked={realTime}
            onCheckedChange={(checked) => setRealTime(checked)}
          />
        </div>

        <Button
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={handlePredict}
        >
          Predecir
          <br />
          Disponibilidad
        </Button>
      </div>

      {showChart && (
        <>
          <Card className="p-4 bg-gray-50">
            <PredictionChart />
          </Card>

          <div className="mt-6 overflow-x-auto">
            <DataTable />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Button
          variant="outline"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          disabled
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Disponibilidad
        </Button>

        <Button
          variant="outline"
          className="bg-blue-900 hover:bg-blue-800 text-white"
          disabled
        >
          <Percent className="mr-2 h-4 w-4" />
          Porcentaje Disponibilidad
        </Button>
      </div>

      <div className="mt-4">
        <Button
          className="w-full bg-blue-900 hover:bg-blue-800 text-white"
          disabled
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar predicción (FER)
        </Button>
      </div>
    </div>
  );
}
