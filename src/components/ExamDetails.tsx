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
  const [showAddExistingForm, setShowAddExistingForm] = useState(false);
  const [showCriteriaForm, setShowCriteriaForm] = useState<Id<"questions"> | null>(null);
  const [selectedQuestionBank, setSelectedQuestionBank] = useState<Id<"questionBanks"> | "">("");
  const [questionForm, setQuestionForm] = useState({
    identificador: "",
    enunciado: "",
    peso: 10,
    linhas: 5,
  });
  const [criteriaForm, setCriteriaForm] = useState({
    regra: "",
    tipo: "PALAVRA CHAVE" as "PALAVRA CHAVE" | "SEMANTICO",
  });

  const examDetails = useQuery(api.exams.getExamWithDetails, { examId });
  const questionBanks = useQuery(api.questionBanks.listQuestionBanks) || [];
  const questionsFromBank = useQuery(
    api.questions.listQuestions,
    selectedQuestionBank ? { questionBankId: selectedQuestionBank as Id<"questionBanks"> } : "skip"
  ) || [];
  const createQuestionForExam = useMutation(api.questions.createQuestionForExam);
  const addQuestionToExam = useMutation(api.questions.addQuestionToExam);
  const removeQuestionFromExam = useMutation(api.questions.removeQuestionFromExam);
  const createCriterion = useMutation(api.questions.createCriterion);
  const deleteCriterion = useMutation(api.questions.deleteCriterion);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createQuestionForExam({
        examId,
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

  const handleAddExistingQuestion = async (questionId: Id<"questions">) => {
    try {
      await addQuestionToExam({
        examId,
        questionId,
      });
      toast.success("Questão adicionada à prova com sucesso!");
      setShowAddExistingForm(false);
      setSelectedQuestionBank("");
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
        regra: criteriaForm.regra,
        tipo: criteriaForm.tipo,
      });
      toast.success("Critério criado com sucesso!");
      setCriteriaForm({
        regra: "",
        tipo: "PALAVRA CHAVE",
      });
      setShowCriteriaForm(null);
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const handleRemoveQuestion = async (questionId: Id<"questions">) => {
    if (confirm("Tem certeza que deseja remover esta questão da prova? (A questão permanecerá no banco de questões)")) {
      try {
        await removeQuestionFromExam({ examId, questionId });
        toast.success("Questão removida da prova com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  const handleDeleteCriterion = async (criterionId: Id<"questionCriteria">) => {
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
          <h2 className="text-xl font-semibold text-gray-900">{examDetails.titulo}</h2>
        </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Pontuação Total</p>
            <p className="text-lg font-semibold">{examDetails.peso} pontos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Questões</p>
            <p className="text-lg font-semibold">{examDetails.questions.length}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowQuestionForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Nova Questão
          </button>
          <button
            onClick={() => setShowAddExistingForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Adicionar Questão Existente
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

      {showAddExistingForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Questão Existente</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecionar Banco de Questões *
              </label>
              <select
                value={selectedQuestionBank}
                onChange={(e) => setSelectedQuestionBank(e.target.value as Id<"questionBanks"> | "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um banco...</option>
                {questionBanks.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.titulo}
                  </option>
                ))}
              </select>
            </div>

            {selectedQuestionBank && questionsFromBank.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questões Disponíveis
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {questionsFromBank.map((question) => {
                    // Verificar se a questão já está na prova
                    const isAlreadyAdded = examDetails.questions.some(
                      (eq) => eq._id === question._id
                    );
                    
                    return (
                      <div
                        key={question._id}
                        className={`p-3 border rounded-md ${
                          isAlreadyAdded
                            ? "bg-gray-100 border-gray-300 opacity-60"
                            : "bg-white border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {question.identificador} ({question.peso} pontos)
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {question.enunciado.substring(0, 100)}
                              {question.enunciado.length > 100 ? "..." : ""}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Linhas: {question.linhas}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddExistingQuestion(question._id)}
                            disabled={isAlreadyAdded}
                            className={`ml-4 px-3 py-1 rounded text-sm ${
                              isAlreadyAdded
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {isAlreadyAdded ? "Já adicionada" : "Adicionar"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedQuestionBank && questionsFromBank.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Este banco de questões não possui questões cadastradas.
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddExistingForm(false);
                  setSelectedQuestionBank("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {examDetails.questions.map((question) => (
          <div key={question._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {question.identificador} ({question.peso} pontos)
                </h3>
                <p className="text-gray-600 mt-2">{question.enunciado}</p>
                <p className="text-sm text-gray-500 mt-1">Linhas: {question.linhas}</p>
              </div>
              <button
                onClick={() => handleRemoveQuestion(question._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remover da Prova
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        value={criteriaForm.tipo}
                        onChange={(e) => setCriteriaForm({ ...criteriaForm, tipo: e.target.value as "PALAVRA CHAVE" | "SEMANTICO" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PALAVRA CHAVE">Palavra-chave</option>
                        <option value="SEMANTICO">Semântico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {criteriaForm.tipo === "PALAVRA CHAVE" ? "Palavra-chave *" : "Regra Semântica *"}
                      </label>
                      <input
                        type="text"
                        value={criteriaForm.regra}
                        onChange={(e) => setCriteriaForm({ ...criteriaForm, regra: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={criteriaForm.tipo === "PALAVRA CHAVE" ? "Ex: algoritmo, estrutura de dados" : "Regra para avaliação semântica"}
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
                        criterion.tipo === "PALAVRA CHAVE" ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {criterion.tipo === "PALAVRA CHAVE" ? 'Palavra-chave' : 'Semântico'}
                      </span>
                      <span className="text-sm text-gray-700">{criterion.regra}</span>
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
