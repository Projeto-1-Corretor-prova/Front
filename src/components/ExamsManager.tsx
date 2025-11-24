import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { ExamDetails } from "./ExamDetails";

export function ExamsManager() {
  const [selectedClassId, setSelectedClassId] = useState<Id<"classes"> | "">("");
  const [selectedExamId, setSelectedExamId] = useState<Id<"exams"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalPoints: 100,
  });

  const classes = useQuery(api.classes.listClasses) || [];
  const exams = useQuery(
    api.exams.listExams,
    selectedClassId ? { classId: selectedClassId as Id<"classes"> } : { classId: undefined }
  ) || [];
  
  const createExam = useMutation(api.exams.createExam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClassId) {
      toast.error("Selecione uma turma");
      return;
    }

    try {
      await createExam({
        classId: selectedClassId as Id<"classes">,
        ...formData,
        description: formData.description || undefined,
      });
      toast.success("Prova criada com sucesso!");
      resetForm();
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      totalPoints: 100,
    });
    setShowForm(false);
  };

  if (selectedExamId) {
    return (
      <ExamDetails 
        examId={selectedExamId} 
        onBack={() => setSelectedExamId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Provas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Prova
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">Filtrar por turma:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value as Id<"classes"> | "")}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as turmas</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.name} ({classItem.code})
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Prova</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turma *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value as Id<"classes"> | "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma turma</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name} ({classItem.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Prova *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Total *
              </label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Criar Prova
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => {
          const examClass = classes.find(c => c._id === exam.classId);
          return (
            <div key={exam._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                Turma: {examClass?.name} ({examClass?.code})
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Pontuação: {exam.totalPoints} pontos
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Criada em: {new Date(exam.createdAt).toLocaleDateString()}
              </p>
              
              {exam.description && (
                <p className="text-sm text-gray-500 mb-3">{exam.description}</p>
              )}

              <button
                onClick={() => setSelectedExamId(exam._id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Gerenciar Questões
              </button>
            </div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {selectedClassId 
            ? "Nenhuma prova encontrada para esta turma." 
            : "Nenhuma prova cadastrada. Clique em 'Nova Prova' para começar."
          }
        </div>
      )}
    </div>
  );
}
