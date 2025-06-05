"use client";

import * as React from "react";
import { format, isSameMonth, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MonthRange = {
  from: Date | null;
  to: Date | null;
};

interface MonthRangePickerProps {
  className?: string;
  monthRange: MonthRange;
  setMonthRange: React.Dispatch<React.SetStateAction<MonthRange>>;
}

export function MonthRangePicker({
  className,
  monthRange,
  setMonthRange,
}: MonthRangePickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const months = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      return new Date(currentYear, i, 1);
    });
  }, [currentYear]);

  const handleMonthClick = (date: Date) => {
    if (!monthRange.from || (monthRange.from && monthRange.to)) {
      setMonthRange({ from: date, to: null });
    } else {
      if (isBefore(date, monthRange.from)) {
        setMonthRange({ from: date, to: monthRange.from });
      } else {
        setMonthRange({ from: monthRange.from, to: date });
      }
    }
  };

  const isSelected = (date: Date) => {
    if (!monthRange.from) return false;

    if (!monthRange.to) return isSameMonth(date, monthRange.from);

    return (
      isSameMonth(date, monthRange.from) ||
      isSameMonth(date, monthRange.to) ||
      (isAfter(date, monthRange.from) && isBefore(date, monthRange.to))
    );
  };

  const isRangeStart = (date: Date) => {
    return monthRange.from && isSameMonth(date, monthRange.from);
  };

  const isRangeEnd = (date: Date) => {
    return monthRange.to && isSameMonth(date, monthRange.to);
  };

  const isInRange = (date: Date) => {
    if (!monthRange.from || !monthRange.to) {
      if (monthRange.from && hoverDate) {
        return (
          (isAfter(date, monthRange.from) && isBefore(date, hoverDate)) ||
          (isAfter(date, hoverDate) && isBefore(date, monthRange.from))
        );
      }
      return false;
    }

    return isAfter(date, monthRange.from) && isBefore(date, monthRange.to);
  };

  const handleMouseEnter = (date: Date) => {
    if (monthRange.from && !monthRange.to) {
      setHoverDate(date);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const prevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevYear}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">{currentYear}</h2>
        <Button variant="outline" size="icon" onClick={nextYear}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {months.map((date) => (
          <Button
            key={date.toISOString()}
            variant="outline"
            className={cn(
              "h-10 justify-center",
              isSelected(date) && "bg-primary text-primary-foreground",
              isRangeStart(date) && "rounded-l-md",
              isRangeEnd(date) && "rounded-r-md",
              isInRange(date) && "bg-primary/20"
            )}
            onClick={() => handleMonthClick(date)}
            onMouseEnter={() => handleMouseEnter(date)}
            onMouseLeave={handleMouseLeave}
          >
            {format(date, "MMM", { locale: es })}
          </Button>
        ))}
      </div>
    </div>
  );
}
