"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Calendar, Pill, TrendingUp, Package} from "lucide-react";
import {MonthRangeDropdown} from "@/components/ui/month-range-dropdown";
import {MonthRange} from "@/components/ui/month-range-picker";
import {addMonths, isBefore, isSameMonth} from "date-fns";

interface PredictionData {
  medcod: string;
  stockFin: string;
  startDate: string;
  endDate: string;
  price: string;
}

export default function PrediccionPastillasPage() {
  const [formData, setFormData] = useState<PredictionData>({
    medcod: "",
    stockFin: "",
    startDate: "",
    endDate: "",
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PredictionData>>({});
  const [monthRange, setMonthRange] = useState<MonthRange>({
    from: null,
    to: null,
  });
  const [result, setResult] = useState<{
    codigo_med: string;
    prediction: Array<{
      date: string;
      prediction: number;
    }>;
  }>({
    codigo_med: "",
    prediction: [],
  });

  const getMonthsInRange = (monthRange: MonthRange) => {
    if (!monthRange.from || !monthRange.to) return [];

    const months: Date[] = [];

    const startDate = new Date(monthRange.from);

    const endDate = new Date(monthRange.to);
    let currentDate = startDate;
    while (
      isBefore(currentDate, endDate) ||
      isSameMonth(currentDate, endDate)
    ) {
      months.push(new Date(currentDate));
      currentDate = addMonths(currentDate, 1);
    }

    return months.map(
      (date) => date.toISOString().slice(5, 7) + "-" + date.getFullYear()
    );
  };

  const handleInputChange = (field: keyof PredictionData, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: ""}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PredictionData> = {};

    if (!formData.medcod.trim()) newErrors.medcod = "MEDCOD es requerido";
    if (!formData.stockFin.trim())
      newErrors.stockFin = "Stock final es requerido";
    if (monthRange.from === null)
      newErrors.startDate = "Fecha de inicio es requerida";
    if (monthRange.to === null) newErrors.endDate = "Fecha de fin es requerida";
    if (!formData.price.trim()) newErrors.price = "Precio es requerido";

    if (
      monthRange.from !== null &&
      monthRange.to !== null &&
      monthRange.from >= monthRange.to
    ) {
      newErrors.endDate =
        "La fecha de fin debe ser posterior a la fecha de inicio";
    }

    if (formData.stockFin && isNaN(Number(formData.stockFin))) {
      newErrors.stockFin = "El stock debe ser un número válido";
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = "El price debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;
    const months = getMonthsInRange(monthRange);
    console.log(months);
    console.log("Datos de entrada:", {
      medcod: formData.medcod,
      stockFin: formData.stockFin,
      dates: months,
      price: formData.price,
    });
    setIsLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/data/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_med: formData.medcod,
        stock_fin: formData.stockFin,
        dates: months,
        price: formData.price,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Respuesta de la API:", data);
        if (data.error) {
          console.log("Error en la predicción:", data.error);
          setIsLoading(false);
          return;
        }

        setResult({
          codigo_med: data.codigo_med,
          prediction: data.prediction,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al realizar la predicción:", error);
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold tracking-tight">
            Predicción de Demanda de Pastillas
          </h2>
        </div>
        <p className="text-muted-foreground">
          Estimar la demanda futura de medicamentos, prototipo en
          implementacion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="py-0">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg py-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Datos de Entrada
            </CardTitle>
            <CardDescription className="text-emerald-50">
              Ingresa los datos necesarios para realizar la predicción
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="medcod"
                className="text-sm font-medium text-gray-700"
              >
                Código de Medicina (MEDCOD)
              </Label>
              <Input
                id="medcod"
                placeholder="Ej: MED001"
                value={formData.medcod}
                onChange={(e) => handleInputChange("medcod", e.target.value)}
                className={errors.medcod ? "border-red-500" : ""}
              />
              {errors.medcod && (
                <p className="text-sm text-red-600">{errors.medcod}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="stockFin"
                className="text-sm font-medium text-gray-700"
              >
                Stock Final
              </Label>
              <Input
                id="stockFin"
                type="number"
                placeholder="Ej: 500"
                value={formData.stockFin}
                onChange={(e) => handleInputChange("stockFin", e.target.value)}
                className={errors.stockFin ? "border-red-500" : ""}
              />
              {errors.stockFin && (
                <p className="text-sm text-red-600">{errors.stockFin}</p>
              )}
            </div>

            <div className=" gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Mes de Inicio y Fin
                </Label>

                <MonthRangeDropdown
                  monthRange={monthRange}
                  setMonthRange={setMonthRange}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate}</p>
                )}
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Precio por Unidad ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Ej: 25.50"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <Separator />

            <Button
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Realizar Predicción
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-t-lg py-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultados de Predicción
            </CardTitle>
            <CardDescription className="text-slate-200">
              Análisis y recomendaciones basadas en los datos ingresados
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {result.prediction.length === 0 ||
            result.prediction === undefined ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  Ingresa los datos y haz clic en Realizar Predicción para ver
                  los resultados
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">
                        Demanda Predicha
                      </p>
                      <p className="text-2xl font-bold text-emerald-900">
                        {result.prediction.map((item, index) => (
                          <p key={index}>
                            {item.date}: {item.prediction}
                          </p>
                        ))}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
