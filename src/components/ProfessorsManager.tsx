import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Modal } from "./ui/Modal";
import { EntityCard } from "./ui/EntityCard";
import { EntityGrid } from "./ui/EntityGrid";

export function ProfessorsManager() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    department: "",
  });

  const profile = useQuery(api.professors.getCurrentProfile);
  const updateProfile = useMutation(api.professors.updateProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        name: formData.name,
        institution: formData.institution || undefined,
        department: formData.department || undefined,
      });
      toast.success("Perfil atualizado com sucesso!");
      resetForm();
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const resetForm = () => {
    if (profile) {
      setFormData({
        name: profile.nome || "",
        institution: profile.institution || "",
        department: profile.department || "",
      });
    }
    setShowModal(false);
  };

  const handleEdit = () => {
    if (profile) {
      setFormData({
        name: profile.nome || "",
        institution: profile.institution || "",
        department: profile.department || "",
      });
      setShowModal(true);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        Perfil não encontrado. Por favor, configure seu perfil primeiro.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Perfil</h2>
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Editar Perfil
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title="Editar Perfil"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
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
              Instituição
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Atualizar
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

      <EntityGrid>
        <EntityCard
          title={profile.nome}
          subtitle={profile.email}
          description={
            <>
              {profile.institution && <div>Instituição: {profile.institution}</div>}
              {profile.department && <div>Departamento: {profile.department}</div>}
            </>
          }
          onEdit={handleEdit}
        />
      </EntityGrid>
    </div>
  );
}

