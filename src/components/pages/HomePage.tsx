import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "../ui/Card";

export function HomePage() {
  const classes = useQuery(api.classes.listClasses) || [];
  const professorProfile = useQuery(api.professors.getCurrentProfile);

  // Calcular total de alunos
  // Por enquanto, vamos usar um valor mockado baseado nas imagens
  // Em produção, isso seria calculado somando os alunos únicos de todas as turmas
  const totalStudents = 115;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Início</h1>
        <p className="text-gray-600">Gerencie e visualize suas informações</p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray mb-2">Bem-vindo ao Sistema</h2>
        <p className="text-gray-600 mb-6">
          Gerencie suas turmas e correções de forma eficiente
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-light rounded-lg p-6">
            <div className="text-4xl font-bold text-blue mb-2">{classes.length}</div>
            <div className="text-gray-600">Turmas</div>
          </div>
          <div className="bg-blue-light rounded-lg p-6">
            <div className="text-4xl font-bold text-blue mb-2">{totalStudents}</div>
            <div className="text-gray-600">Alunos</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

