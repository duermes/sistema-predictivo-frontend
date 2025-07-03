"use client";
import {useState} from "react";
import {FileDown, Percent} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Select, type SelectOption} from "@/components/ui/select";

import {Checkbox} from "@/components/ui/checkbox";
// import {Card} from "@/components/ui/card";
// import { PredictionChart } from "@/components/dashboard/prediction-chart";
import {DataTable} from "./data-table";
import {MonthRangeDropdown} from "@/components/ui/month-range-dropdown";
import {MonthRange} from "../ui/month-range-picker";

const productTypeOptions: SelectOption[] = [
  {value: "I", label: "Insumo"},
  {value: "M", label: "Medicamento"},
];

const demandSupportOptions: SelectOption[] = [
  {value: "_", label: "Demanda"},
  {value: "S", label: "Soporte"},
  {value: "E", label: "Estrategia"},
];

const timeOptions: SelectOption[] = [
  {value: "trimestral", label: "Trimestral"},
];

const formatToYYYYMM = (date: Date) => {
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
};

export function PredictiveSystem() {
  const [productType, setProductType] = useState<string[]>([]);
  const [demandSupport, setDemandSupport] = useState<string[]>([]);
  const [monthRange, setMonthRange] = useState<MonthRange>({
    from: null,
    to: null,
  });
  const [realTime, setRealTime] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  // esta funcion puede que la deje de usar, borrar cuando loading y setLoading funcionen
  const handlePredict = () => {
    if (!productType || !demandSupport || !monthRange.from || !monthRange.to) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }
    getProducts();
    setShowChart(true);
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
      product_type: productType.join(","),
      strategy: demandSupport.join(","),
      real_time: realTime ? "true" : "false",
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/data/summary?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setMonths(data.months);
        setCounter(data.count);
        console.log(data);
        console.log(counter);
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
            values={productType}
            onValuesChange={setProductType}
            placeholder="Tipo de Producto"
          />
        </div>

        <div className="bg-gray-100 p-2 rounded-md">
          <Select
            options={demandSupportOptions}
            values={demandSupport}
            onValuesChange={setDemandSupport}
            placeholder="Estado"
          />
        </div>

        <div className="bg-gray-100 p-2 rounded-md">
          <Select
            options={timeOptions}
            values={[""]}
            onValuesChange={() => {}}
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
          {/* <Card className="p-4 bg-gray-50">
            <PredictionChart />
          </Card> */}
          <p className="text-sm text-gray-500">
            {counter > 0 ? `Se encontraron ${counter} productos` : ""}
          </p>
          <div className="mt-6 overflow-x-auto">
            <DataTable data={data} isLoading={loading} months={months} />
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
