import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { QuestionWithCriteria } from "./QuestionWithCriteria";

interface QuestionBankDetailsProps {
  questionBankId: Id<"questionBanks">;
  onBack: () => void;
}

export function QuestionBankDetails({ questionBankId, onBack }: QuestionBankDetailsProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    identificador: "",
    enunciado: "",
    peso: 10,
    linhas: 5,
  });

  const questionBank = useQuery(api.questionBanks.getQuestionBank, { questionBankId });
  const questions = useQuery(api.questions.listQuestions, { questionBankId }) || [];
  const createQuestion = useMutation(api.questions.createQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createQuestion({
        questionBankId,
        identificador: questionForm.identificador,
        enunciado: questionForm.enunciado,
        peso: questionForm.peso,
        linhas: questionForm.linhas,
      });
      toast.success("Questão criada com sucesso!");
      setQuestionForm({
        identificador: "",
        enunciado: "",
        peso: 10,
        linhas: 5,
      });
      setShowQuestionForm(false);
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const handleDeleteQuestion = async (questionId: Id<"questions">) => {
    if (confirm("Tem certeza que deseja deletar esta questão e todos os seus critérios?")) {
      try {
        await deleteQuestion({ questionId });
        toast.success("Questão deletada com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  if (!questionBank) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{questionBank.titulo}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Total de Questões</p>
            <p className="text-lg font-semibold">{questions.length}</p>
          </div>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Adicionar Questão
          </button>
        </div>
      </div>

      {showQuestionForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Questão</h3>
          
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificador *
                </label>
                <input
                  type="text"
                  value={questionForm.identificador}
                  onChange={(e) => setQuestionForm({ ...questionForm, identificador: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Q1, Questão 1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (Pontos) *
                </label>
                <input
                  type="number"
                  value={questionForm.peso}
                  onChange={(e) => setQuestionForm({ ...questionForm, peso: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linhas *
                </label>
                <input
                  type="number"
                  value={questionForm.linhas}
                  onChange={(e) => setQuestionForm({ ...questionForm, linhas: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enunciado *
              </label>
              <textarea
                value={questionForm.enunciado}
                onChange={(e) => setQuestionForm({ ...questionForm, enunciado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Criar Questão
              </button>
              <button
                type="button"
                onClick={() => setShowQuestionForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionWithCriteria
            key={question._id}
            question={question}
            onDelete={handleDeleteQuestion}
          />
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma questão cadastrada. Clique em "Adicionar Questão" para começar.
        </div>
      )}
    </div>
  );
}

