"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthRangePicker, type MonthRange } from "./month-range-picker";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthRangeDropdownProps {
  className?: string;
  monthRange: MonthRange;
  setMonthRange: React.Dispatch<React.SetStateAction<MonthRange>>;
}

export function MonthRangeDropdown({
  className,
  monthRange,
  setMonthRange,
}: MonthRangeDropdownProps) {
  // Formatear el texto del botón
  const buttonText = () => {
    if (!monthRange.from) return "Seleccionar rango de meses";

    if (!monthRange.to) {
      return format(monthRange.from, "MMMM yyyy", { locale: es });
    }

    return `${format(monthRange.from, "MMM yyyy", { locale: es })} - ${format(
      monthRange.to,
      "MMM yyyy",
      { locale: es }
    )}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="month-range"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white",
              !monthRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {buttonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <MonthRangePicker
            monthRange={monthRange}
            setMonthRange={setMonthRange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
