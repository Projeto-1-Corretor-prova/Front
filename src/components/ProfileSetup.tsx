import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSetup() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createProfile = useMutation(api.professors.createProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      await createProfile({
        name: name.trim(),
        institution: institution.trim() || undefined,
        department: department.trim() || undefined,
      });
      toast.success("Perfil criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar perfil: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete seu Perfil
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Instituição
            </label>
            <input
              type="text"
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da instituição"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Departamento ou área"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Criando..." : "Criar Perfil"}
          </button>
        </form>
      </div>
    </div>
  );
}
