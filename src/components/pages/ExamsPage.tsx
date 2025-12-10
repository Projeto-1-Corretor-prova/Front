import { ExamsManager } from "../ExamsManager";

export function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Provas</h1>
        <p className="text-gray-600">Gerencie e visualize suas provas</p>
      </div>
      <ExamsManager />
    </div>
  );
}

