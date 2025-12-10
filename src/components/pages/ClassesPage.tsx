import { ClassesManager } from "../ClassesManager";

export function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Turmas</h1>
        <p className="text-gray-600">Gerencie e visualize suas turmas</p>
      </div>
      <ClassesManager />
    </div>
  );
}

