import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";

export function CorrectionsPage() {
  // Por enquanto, vamos usar dados mockados baseados nas imagens
  // Depois isso será substituído por dados reais do Convex
  const mockStudents = [
    { id: "1", name: "João Silva", grade: 8.5, status: "concluida" as const },
    { id: "2", name: "Maria Santos", grade: 9, status: "concluida" as const },
    { id: "3", name: "Pedro Oliveira", grade: null, status: "pendente" as const },
    { id: "4", name: "Ana Costa", grade: null, status: "pendente" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Correções</h1>
        <p className="text-gray-600">Gerencie e visualize suas correções</p>
      </div>

      <div className="space-y-4">
        {mockStudents.map((student) => (
          <Card key={student.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray mb-2">{student.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Nota:</span>
                  {student.grade !== null ? (
                    <span className="text-2xl font-bold text-blue">{student.grade}</span>
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">-</span>
                  )}
                </div>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <Button className="w-full">
              {student.status === "concluida" ? "Ver Correção" : "Corrigir"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

