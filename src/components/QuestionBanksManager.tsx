import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Modal } from "./ui/Modal";
import { EntityCard } from "./ui/EntityCard";
import { EntityGrid } from "./ui/EntityGrid";
import { QuestionWithCriteria } from "./QuestionWithCriteria";

export function QuestionBanksManager() {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingBank, setEditingBank] = useState<Id<"questionBanks"> | null>(null);
  const [viewingBank, setViewingBank] = useState<Id<"questionBanks"> | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
  });

  const questionBanks = useQuery(api.questionBanks.listQuestionBanks) || [];
  const createQuestionBank = useMutation(api.questionBanks.createQuestionBank);
  const updateQuestionBank = useMutation(api.questionBanks.updateQuestionBank);
  const deleteQuestionBank = useMutation(api.questionBanks.deleteQuestionBank);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBank) {
        await updateQuestionBank({
          questionBankId: editingBank,
          ...formData,
        });
        toast.success("Banco de questões atualizado com sucesso!");
      } else {
        await createQuestionBank({
          ...formData,
        });
        toast.success("Banco de questões criado com sucesso!");
      }
      
      resetForm();
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
    });
    setShowModal(false);
    setEditingBank(null);
  };

  const handleEdit = (bank: any) => {
    setFormData({
      titulo: bank.titulo,
    });
    setEditingBank(bank._id);
    setShowModal(true);
  };

  const handleDelete = async (bankId: Id<"questionBanks">) => {
    if (confirm("Tem certeza que deseja deletar este banco de questões?")) {
      try {
        await deleteQuestionBank({ questionBankId: bankId });
        toast.success("Banco de questões deletado com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  const handleViewBank = (bankId: Id<"questionBanks">) => {
    setViewingBank(bankId);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setViewingBank(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Bancos de Questões</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Banco
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingBank ? "Editar Banco de Questões" : "Novo Banco de Questões"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingBank ? "Atualizar" : "Criar"}
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
      </Modal>

      <QuestionBankDetailsModal
          questionBankId={viewingBank || ("" as Id<"questionBanks">)}
          isOpen={showDetailsModal && !!viewingBank}
          onClose={handleCloseDetails}
        />

      <EntityGrid emptyMessage="Nenhum banco de questões cadastrado. Clique em 'Novo Banco' para começar.">
        {questionBanks.map((bank) => (
          <EntityCard
            key={bank._id}
            title={bank.titulo}
            onEdit={() => handleEdit(bank)}
            onDelete={() => handleDelete(bank._id)}
          >
            <button
              onClick={() => handleViewBank(bank._id)}
              className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg font-bold">+</span> 
              <span>Gerenciar Questões</span>
            </button>
          </EntityCard>
        ))}
      </EntityGrid>
    </div>
  );
}

// Componente Modal para detalhes do banco de questões
function QuestionBankDetailsModal({
  questionBankId,
  isOpen,
  onClose,
}: {
  questionBankId: Id<"questionBanks">;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    identificador: "",
    enunciado: "",
    peso: 10,
    linhas: 5,
  });

  const questionBank = useQuery(
    api.questionBanks.getQuestionBank,
    questionBankId ? { questionBankId } : "skip"
  );
  const questions = useQuery(
    api.questions.listQuestions,
    questionBankId ? { questionBankId } : "skip"
  );
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

  if (!isOpen || !questionBankId) return null;

  const isLoading = questionBank === undefined || questions === undefined;
  const questionsList = questions || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={questionBank ? questionBank.titulo : "Carregando..."}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total de Questões</p>
                  <p className="text-lg font-semibold">{questionsList.length}</p>
                </div>
                <button
                  onClick={() => setShowQuestionForm(!showQuestionForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">+</span> Adicionar Questão
                </button>
              </div>
            </div>

            {showQuestionForm && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
              {questionsList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma questão cadastrada. Clique em "+ Adicionar Questão" para começar.
                </div>
              ) : (
                questionsList.map((question) => (
                  <QuestionWithCriteria
                    key={question._id}
                    question={question}
                    onDelete={handleDeleteQuestion}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

