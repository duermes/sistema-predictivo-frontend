import { PredictiveSystem } from "../components/dashboard/predictive-system";

export default function Dashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sistema Predictivo</h1>
      <PredictiveSystem />
    </main>
  );
}
