import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function ClassesManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Id<"classes"> | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    semester: "",
    year: new Date().getFullYear(),
    description: "",
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
          description: formData.description || undefined,
        });
        toast.success("Turma atualizada com sucesso!");
      } else {
        await createClass({
          ...formData,
          description: formData.description || undefined,
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
      name: "",
      code: "",
      semester: "",
      year: new Date().getFullYear(),
      description: "",
    });
    setShowForm(false);
    setEditingClass(null);
  };

  const handleEdit = (classItem: any) => {
    setFormData({
      name: classItem.name,
      code: classItem.code,
      semester: classItem.semester,
      year: classItem.year,
      description: classItem.description || "",
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

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingClass ? "Editar Turma" : "Nova Turma"}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Turma *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semestre *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione</option>
                <option value="1">1º Semestre</option>
                <option value="2">2º Semestre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2 flex gap-2">
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <div key={classItem._id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(classItem)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-2"
                >
                  Deletar
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-1">Código: {classItem.code}</p>
            <p className="text-sm text-gray-600 mb-1">
              {classItem.semester}º Semestre {classItem.year}
            </p>
            {classItem.description && (
              <p className="text-sm text-gray-500 mt-2">{classItem.description}</p>
            )}
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma turma cadastrada. Clique em "Nova Turma" para começar.
        </div>
      )}
    </div>
  );
}
