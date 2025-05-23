/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

export interface DataItem {
  CODIGO_MED: number;
  MEDNOM: string;
  MEDPRES: string;
  MEDCNC: string;
  MEDTIP: string;
  MEDPET: string;
  MEDFF: string;
  MEDEST: string;
  STOCK_FIN: number;
  CPMA: number;
  CONSUMO_MEN: number;
  NIVELES: number;
  SITUACION: string;
  [key: string]: any;
}

export interface Months {
  date: string;
}

export function DataTable({
  data,
  isLoading,
  months,
}: {
  data: DataItem[];
  isLoading: boolean;
  months: string[];
}) {
  const memoData = useMemo(() => data, [data]);

  if (isLoading) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  if (memoData.length === 0) {
    return <div className="text-center py-4">No hay datos disponibles</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[80px]">Código</TableHead>
            <TableHead className="min-w-[200px]">Nombre Medicamento</TableHead>
            <TableHead>MEDPRES</TableHead>
            <TableHead>MEDCNC</TableHead>
            <TableHead>MEDTIP</TableHead>
            <TableHead>MEDPET</TableHead>
            <TableHead>MEDFF</TableHead>
            {months.map((month) => (
              <TableHead key={month} className="w-[80px]">
                {month}
              </TableHead>
            ))}
            <TableHead>MEDEST</TableHead>
            <TableHead>STOCK_FIN</TableHead>
            <TableHead>CPMA</TableHead>
            <TableHead>Consumo Mensual</TableHead>
            <TableHead>Niveles</TableHead>
            <TableHead>Situación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memoData.map((item, index) => (
            <TableRow key={index} className={getSituationClass(item.SITUACION)}>
              <TableCell>{item.CODIGO_MED}</TableCell>
              <TableCell>{item.MEDNOM}</TableCell>
              <TableCell>{item.MEDPRES}</TableCell>
              <TableCell>{item.MEDCNC}</TableCell>
              <TableCell>{item.MEDTIP}</TableCell>
              <TableCell>{item.MEDPET}</TableCell>
              <TableCell>{item.MEDFF}</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {item[month]}
                </TableCell>
              ))}
              <TableCell>{item.MEDEST}</TableCell>
              <TableCell>{item.STOCK_FIN}</TableCell>
              <TableCell>{item.CPMA}</TableCell>
              <TableCell>{item.CONSUMO_MEN}</TableCell>
              <TableCell>{item.NIVELES}</TableCell>
              <TableCell>{item.SITUACION}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getSituationClass(situation: string): string {
  switch (situation) {
    case "Sobrestock":
      return "bg-yellow-50";
    case "Substock":
      return "bg-red-50";
    case "Normostock":
    default:
      return "";
  }
}
