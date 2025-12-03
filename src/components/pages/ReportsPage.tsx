import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function ReportsPage() {
  const reports = [
    {
      id: "1",
      title: "Desempenho Geral",
      period: "Janeiro 2025",
      detail: "4 turmas",
    },
    {
      id: "2",
      title: "Taxa de Aprovação",
      period: "Janeiro 2025",
      detail: "120 alunos",
    },
    {
      id: "3",
      title: "Médias por Disciplina",
      period: "Janeiro 2025",
      detail: "8 disciplinas",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Relatórios</h1>
        <p className="text-gray-600">Gerencie e visualize suas relatórios</p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <h3 className="text-xl font-bold text-gray mb-2">{report.title}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-gray-600">Período: {report.period}</p>
              <p className="text-gray-600">{report.detail}</p>
            </div>
            <Button className="w-full">Gerar Relatório</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

