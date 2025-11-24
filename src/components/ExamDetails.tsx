import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface ExamDetailsProps {
  examId: Id<"exams">;
  onBack: () => void;
}

export function ExamDetails({ examId, onBack }: ExamDetailsProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showCriteriaForm, setShowCriteriaForm] = useState<Id<"questions"> | null>(null);
  const [questionForm, setQuestionForm] = useState({
    questionNumber: 1,
    questionText: "",
    points: 10,
    expectedAnswer: "",
  });
  const [criteriaForm, setCriteriaForm] = useState({
    criteriaText: "",
    points: 5,
    isKeyword: true,
    weight: 1,
  });

  const examDetails = useQuery(api.exams.getExamWithDetails, { examId });
  const createQuestion = useMutation(api.questions.createQuestion);
  const createCriterion = useMutation(api.questions.createCriterion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);
  const deleteCriterion = useMutation(api.questions.deleteCriterion);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createQuestion({
        examId,
        ...questionForm,
        expectedAnswer: questionForm.expectedAnswer || undefined,
      });
      toast.success("Questão criada com sucesso!");
      setQuestionForm({
        questionNumber: (examDetails?.questions.length || 0) + 2,
        questionText: "",
        points: 10,
        expectedAnswer: "",
      });
      setShowQuestionForm(false);
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const handleCriteriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showCriteriaForm) return;

    try {
      await createCriterion({
        questionId: showCriteriaForm,
        ...criteriaForm,
      });
      toast.success("Critério criado com sucesso!");
      setCriteriaForm({
        criteriaText: "",
        points: 5,
        isKeyword: true,
        weight: 1,
      });
      setShowCriteriaForm(null);
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

  const handleDeleteCriterion = async (criterionId: Id<"evaluationCriteria">) => {
    if (confirm("Tem certeza que deseja deletar este critério?")) {
      try {
        await deleteCriterion({ criterionId });
        toast.success("Critério deletado com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  if (!examDetails) {
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
        <h2 className="text-xl font-semibold text-gray-900">{examDetails.title}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Pontuação Total</p>
            <p className="text-lg font-semibold">{examDetails.totalPoints} pontos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Questões</p>
            <p className="text-lg font-semibold">{examDetails.questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-2 py-1 text-sm rounded-full ${
              examDetails.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {examDetails.isActive ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        </div>

        {examDetails.description && (
          <p className="text-gray-600 mb-4">{examDetails.description}</p>
        )}

        <button
          onClick={() => setShowQuestionForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Adicionar Questão
        </button>
      </div>

      {showQuestionForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Questão</h3>
          
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Questão *
                </label>
                <input
                  type="number"
                  value={questionForm.questionNumber}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pontuação *
                </label>
                <input
                  type="number"
                  value={questionForm.points}
                  onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto da Questão *
              </label>
              <textarea
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resposta Esperada (opcional)
              </label>
              <textarea
                value={questionForm.expectedAnswer}
                onChange={(e) => setQuestionForm({ ...questionForm, expectedAnswer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Resposta modelo para comparação com IA"
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
        {examDetails.questions.map((question) => (
          <div key={question._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Questão {question.questionNumber} ({question.points} pontos)
                </h3>
                <p className="text-gray-600 mt-2">{question.questionText}</p>
                {question.expectedAnswer && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 font-medium">Resposta Esperada:</p>
                    <p className="text-sm text-gray-700">{question.expectedAnswer}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteQuestion(question._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Deletar
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Critérios de Avaliação</h4>
                <button
                  onClick={() => setShowCriteriaForm(question._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Adicionar Critério
                </button>
              </div>

              {showCriteriaForm === question._id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <form onSubmit={handleCriteriaSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pontuação *
                        </label>
                        <input
                          type="number"
                          value={criteriaForm.points}
                          onChange={(e) => setCriteriaForm({ ...criteriaForm, points: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (0-1) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          value={criteriaForm.weight}
                          onChange={(e) => setCriteriaForm({ ...criteriaForm, weight: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo *
                        </label>
                        <select
                          value={criteriaForm.isKeyword ? "keyword" : "expected"}
                          onChange={(e) => setCriteriaForm({ ...criteriaForm, isKeyword: e.target.value === "keyword" })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="keyword">Palavra-chave</option>
                          <option value="expected">Resposta esperada</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {criteriaForm.isKeyword ? "Palavra-chave *" : "Resposta esperada *"}
                      </label>
                      <input
                        type="text"
                        value={criteriaForm.criteriaText}
                        onChange={(e) => setCriteriaForm({ ...criteriaForm, criteriaText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={criteriaForm.isKeyword ? "Ex: algoritmo, estrutura de dados" : "Resposta modelo para comparação"}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCriteriaForm(null)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-2">
                {question.criteria.map((criterion) => (
                  <div key={criterion._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                        criterion.isKeyword ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {criterion.isKeyword ? 'Palavra-chave' : 'Resposta esperada'}
                      </span>
                      <span className="text-sm text-gray-700">{criterion.criteriaText}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({criterion.points} pts, peso: {criterion.weight})
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCriterion(criterion._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                ))}
              </div>

              {question.criteria.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Nenhum critério de avaliação definido.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {examDetails.questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma questão cadastrada. Clique em "Adicionar Questão" para começar.
        </div>
      )}
    </div>
  );
}
