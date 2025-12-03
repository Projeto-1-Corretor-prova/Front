import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";

export function ExamsPage() {
  const exams = useQuery(api.exams.listExams, { classId: undefined }) || [];
  const classes = useQuery(api.classes.listClasses) || [];

  // Função para determinar o status da prova
  const getExamStatus = (exam: any): "pendente" | "corrigida" | "em-correcao" => {
    // Lógica para determinar status baseado nos dados da prova
    // Por enquanto, vamos usar um mock baseado nas imagens
    if (exam.title?.includes("1")) return "pendente";
    if (exam.title?.includes("2")) return "corrigida";
    if (exam.title?.includes("3")) return "em-correcao";
    return "pendente";
  };

  // Função para obter a data formatada
  const getExamDate = (exam: any): string => {
    if (exam.createdAt) {
      return new Date(exam.createdAt).toLocaleDateString("pt-BR");
    }
    // Mock dates para demonstração
    const dates: Record<string, string> = {
      "1": "15/01/2025",
      "2": "20/01/2025",
      "3": "22/01/2025",
      "4": "25/01/2025",
    };
    const match = exam.title?.match(/(\d+)/);
    return match ? dates[match[1]] || "Data não definida" : "Data não definida";
  };

  // Função para obter o assunto da prova
  const getExamSubject = (exam: any): string => {
    const subjects: Record<string, string> = {
      "1": "Álgebra Linear",
      "2": "Gramática",
      "3": "Mecânica",
      "4": "Orgânica",
    };
    const match = exam.title?.match(/(\d+)/);
    return match ? subjects[match[1]] || exam.description || "Sem assunto" : exam.description || "Sem assunto";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Provas</h1>
        <p className="text-gray-600">Gerencie e visualize suas provas</p>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => {
          const status = getExamStatus(exam);
          const examClass = classes.find((c) => c._id === exam.classId);
          
          return (
            <Card key={exam._id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray mb-2">
                    {exam.title || `Prova ${exam._id}`}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    {getExamSubject(exam)}
                  </p>
                  <p className="text-gray-600">
                    Data: {getExamDate(exam)}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
              <Button className="w-full">Ver Detalhes</Button>
            </Card>
          );
        })}
      </div>

      {exams.length === 0 && (
        <Card>
          <p className="text-center text-gray-600 py-8">
            Nenhuma prova cadastrada ainda.
          </p>
        </Card>
      )}
    </div>
  );
}

