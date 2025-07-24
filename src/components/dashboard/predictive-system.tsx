"use client";
import {Button} from "@/components/ui/button";
import {Select, type SelectOption} from "@/components/ui/select";
import jsPDF from "jspdf";

import {Checkbox} from "@/components/ui/checkbox";

import {DataTable} from "./data-table";
import {MonthRangeDropdown} from "@/components/ui/month-range-dropdown";
import {MonthRange} from "../ui/month-range-picker";
import { useState } from "react";

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
          Aceptar
        </Button>
      </div>

      <div className="mt-4 gap-4 mx-5">

        <Button
          className="w-full bg-green-700 hover:bg-green-600 text-white"
          onClick={() => {
            const doc = new jsPDF("landscape");
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            let yPosition = 20;

            // Cabecera
            doc.setFillColor(0, 32, 96);
            doc.rect(0, 0, pageWidth, 40, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text("Reporte de Predicción", pageWidth / 2, 25, {
              align: "center",
            });

            // Información del reporte
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            yPosition = 50;

            doc.text(
              `Fecha de generación: ${new Date().toLocaleDateString()}`,
              20,
              yPosition
            );
            doc.text(
              `Tipo de producto: ${
                productTypeOptions.find((opt) =>
                  productType.includes(opt.value)
                )?.label || ""
              }`,
              20,
              yPosition + 10
            );
            doc.text(
              `Estado: ${
                demandSupportOptions.find((opt) =>
                  demandSupport.includes(opt.value)
                )?.label || ""
              }`,
              20,
              yPosition + 20
            );
            doc.text(
              `Periodo: ${monthRange.from?.toLocaleDateString()} - ${monthRange.to?.toLocaleDateString()}`,
              20,
              yPosition + 30
            );

            // Datos de predicción
            yPosition = 100;
            doc.setFontSize(14);
            doc.setFillColor(240, 240, 240);
            doc.rect(15, yPosition - 5, pageWidth - 30, 10, "F");
            doc.text("Datos de predicción", 20, yPosition);

            // Configuración de la tabla
            const headers = [
              "Código",
              // "Nombre Med.",
              "MEDPRES",
              "MEDCNC",
              "MEDTIP",
              "MEDPET",
              "MEDFF",
              ...months,
              // "MEDEST",
              // "STOCK_FIN",
              // "CPMA",
              // "Consumo",
              // "Niveles",
              // "Situación",
            ];

            const startX = 15;
            const columnWidth = (pageWidth - 30) / headers.length;
            yPosition = 120;

            // Dibujar encabezados
            doc.setFillColor(0, 32, 96);
            doc.rect(startX, yPosition - 5, pageWidth - 30, 10, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);

            headers.forEach((header, index) => {
              doc.text(
                String(header),
                startX + columnWidth * index + 2,
                yPosition
              );
            });

            // Datos de la tabla
            doc.setTextColor(0, 0, 0);
            yPosition += 10;
            let currentPage = 1;

            data.forEach((item: any, index: number) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                currentPage++;
                yPosition = 20;

                // Repetir encabezados en nueva página
                doc.setFillColor(0, 32, 96);
                doc.rect(startX, yPosition - 5, pageWidth - 30, 10, "F");
                doc.setTextColor(255, 255, 255);
                headers.forEach((header, headerIndex) => {
                  doc.text(
                    String(header),
                    startX + columnWidth * headerIndex + 2,
                    yPosition
                  );
                });
                doc.setTextColor(0, 0, 0);
                yPosition += 10;
              }

              const rowY = yPosition;

              // Convertir todos los valores a string y asegurar que existan
              const values = [
                String(item.CODIGO_MED || ""),
                // String(item.MEDNOM || ""),
                String(item.MEDTIP || ""),
                String(item.MEDPET || ""),
                String(item.MEDFF || ""),
              ];

              // Agregar los valores de predicción por mes
              months.forEach((month) => {
                values.push(String(item[month] || "100"));
              });

              // values.push(
              //   String(item.medest || ""),
              //   String(item.stock_fin || ""),
              //   String(item.consumo || ""),
              //   String(item.niveles || ""),
              //   String(item.situacion || "")
              // );

              // Dibujar los valores
              values.forEach((value, valueIndex) => {
                doc.text(value, startX + columnWidth * valueIndex + 2, rowY);
              });

              yPosition += 8;
            });

            // Pie de página en todas las páginas
            for (let i = 1; i <= currentPage; i++) {
              doc.setPage(i);
              doc.setFontSize(10);
              doc.text(
                `Página ${i} de ${currentPage}`,
                pageWidth / 2,
                pageHeight - 10,
                {align: "center"}
              );
            }

            doc.save("reporte-prediccion.pdf");
          }}
        >
          Exportar PDF
        </Button>
      </div>

      {showChart && (
        <>
          <p className="text-sm text-gray-500">
            {counter > 0 ? `Se encontraron ${counter} productos` : ""}
          </p>
          <div className="mt-6 overflow-x-auto">
            <DataTable data={data} isLoading={loading} months={months} />
          </div>
        </>
      )}
    </div>
  );
}
