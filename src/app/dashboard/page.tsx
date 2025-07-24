import {PredictiveSystem} from "../../components/dashboard/predictive-system";

export default function Dashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Historial de consumo</h1>
      <p>Seleccionar tipo de pastilla</p>
      <PredictiveSystem />
    </main>
  );
}
