import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Modal } from "./ui/Modal";
import { EntityCard } from "./ui/EntityCard";
import { EntityGrid } from "./ui/EntityGrid";

export function ClassesManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Id<"classes"> | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
  });

  const classes = useQuery(api.classes.listClasses) || [];
  const createClass = useMutation(api.classes.createClass);
  const updateClass = useMutation(api.classes.updateClass);
  const deleteClass = useMutation(api.classes.deleteClass);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClass) {
        await updateClass({
          classId: editingClass,
          ...formData,
        });
        toast.success("Turma atualizada com sucesso!");
      } else {
        await createClass({
          ...formData,
        });
        toast.success("Turma criada com sucesso!");
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
    setShowForm(false);
    setEditingClass(null);
  };

  const handleEdit = (classItem: any) => {
    setFormData({
      titulo: classItem.titulo,
    });
    setEditingClass(classItem._id);
    setShowForm(true);
  };

  const handleDelete = async (classId: Id<"classes">) => {
    if (confirm("Tem certeza que deseja deletar esta turma?")) {
      try {
        await deleteClass({ classId });
        toast.success("Turma deletada com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Turmas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Turma
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingClass ? "Editar Turma" : "Nova Turma"}
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
              {editingClass ? "Atualizar" : "Criar"}
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

      <EntityGrid emptyMessage="Nenhuma turma cadastrada. Clique em 'Nova Turma' para começar.">
        {classes.map((classItem) => (
          <EntityCard
            key={classItem._id}
            title={classItem.titulo}
            onEdit={() => handleEdit(classItem)}
            onDelete={() => handleDelete(classItem._id)}
          />
        ))}
      </EntityGrid>
    </div>
  );
}
