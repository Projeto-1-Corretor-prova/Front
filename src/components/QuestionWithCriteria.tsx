import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

interface QuestionWithCriteriaProps {
  question: {
    _id: Id<"questions">;
    identificador: string;
    enunciado: string;
    peso: number;
    linhas: number;
  };
  onDelete: (questionId: Id<"questions">) => void;
}

export function QuestionWithCriteria({ question, onDelete }: QuestionWithCriteriaProps) {
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [criteriaForm, setCriteriaForm] = useState({
    regra: "",
    tipo: "PALAVRA CHAVE" as "PALAVRA CHAVE" | "SEMANTICO",
  });

  const criteria = useQuery(api.questions.listCriteria, { questionId: question._id }) || [];
  const createCriterion = useMutation(api.questions.createCriterion);
  const deleteCriterion = useMutation(api.questions.deleteCriterion);

  const handleCriteriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCriterion({
        questionId: question._id,
        regra: criteriaForm.regra,
        tipo: criteriaForm.tipo,
      });
      toast.success("Critério criado com sucesso!");
      setCriteriaForm({
        regra: "",
        tipo: "PALAVRA CHAVE",
      });
      setShowCriteriaForm(false);
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {question.identificador} ({question.peso} pontos)
          </h3>
          <p className="text-gray-600 mt-2">{question.enunciado}</p>
          <p className="text-sm text-gray-500 mt-1">Linhas: {question.linhas}</p>
        </div>
        <button
          onClick={() => onDelete(question._id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Deletar
        </button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-900">Critérios de Avaliação</h4>
          <button
            onClick={() => setShowCriteriaForm(true)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Adicionar Critério
          </button>
        </div>

        {showCriteriaForm && (
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
                  onClick={() => setShowCriteriaForm(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-2">
          {criteria.map((criterion) => (
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

        {criteria.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Nenhum critério de avaliação definido.
          </p>
        )}
      </div>
    </div>
  );
}

