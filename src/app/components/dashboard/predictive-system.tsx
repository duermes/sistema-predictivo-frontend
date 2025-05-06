"use client";

import { useState } from "react";
import { DatePickerWithRange } from "@/app/components/dashboard/date-range-picker";
import { FileDown, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/app/components/dashboard/select";

import { Checkbox } from "@/app/components/dashboard/checkbox";
import { Card } from "@/components/ui/card";
import type { DateRange } from "react-day-picker";
import { PredictionChart } from "@/app/components/dashboard/prediction-chart";
import { DataTable } from "./data-table";

const productTypeOptions: SelectOption[] = [
  { value: "S", label: "Insumo" },
  { value: "D", label: "Medicamento" },
];

const demandSupportOptions: SelectOption[] = [
  { value: "demanda", label: "Demanda" },
  { value: "soporte", label: "Soporte" },
  { value: "estrategia", label: "Estrategia" },
];

const timeOptions: SelectOption[] = [
  { value: "trimestral", label: "Trimestral" },
];

export function PredictiveSystem() {
  const [productType, setProductType] = useState<string>("");
  const [demandSupport, setDemandSupport] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [realTime, setRealTime] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handlePredict = () => {
    if (!productType || !demandSupport || !dateRange?.from) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }

    setShowChart(true);

    console.log({
      productType,
      demandSupport,
      dateRange,
      realTime,
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
            <DatePickerWithRange
              dateRange={dateRange}
              setDateRange={setDateRange}
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
