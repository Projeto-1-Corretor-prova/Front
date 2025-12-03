import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { UsersIcon } from "../ui/Icons";

export function ClassesPage() {
  const classes = useQuery(api.classes.listClasses) || [];
  const exams = useQuery(api.exams.listExams, { classId: undefined }) || [];

  // Contar alunos únicos por turma através das submissões
  // Por enquanto, vamos usar um valor mockado baseado nas imagens
  const getStudentCount = (classId: string): number => {
    const classExams = exams.filter((exam) => exam.classId === classId);
    // Mock: valores baseados nas imagens
    const mockCounts: Record<string, number> = {
      // Estes valores seriam calculados dinamicamente em produção
    };
    // Por padrão, retornar um valor aleatório entre 25-35 para demonstração
    return 30;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Turmas</h1>
        <p className="text-gray-600">Gerencie e visualize suas turmas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => {
          // Extrair número da turma para mock
          const match = classItem.name.match(/(\w+)/);
          const mockCounts: Record<string, number> = {
            A: 32,
            B: 28,
            C: 30,
            D: 25,
          };
          const studentCount = match ? mockCounts[match[1]] || 30 : getStudentCount(classItem._id);
          
          return (
            <Card key={classItem._id} className="relative">
              <div className="absolute top-4 right-4 text-blue-light opacity-50">
                <UsersIcon />
              </div>
              <h3 className="text-xl font-bold text-gray mb-2 pr-12">{classItem.name}</h3>
              <p className="text-gray-600 mb-4">{studentCount} alunos</p>
              <Button className="w-full">Acessar Turma</Button>
            </Card>
          );
        })}
      </div>

      {classes.length === 0 && (
        <Card>
          <p className="text-center text-gray-600 py-8">
            Nenhuma turma cadastrada ainda.
          </p>
        </Card>
      )}
    </div>
  );
}

