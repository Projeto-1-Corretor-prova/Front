import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Modal } from "./ui/Modal";
import { EntityCard } from "./ui/EntityCard";
import { EntityGrid } from "./ui/EntityGrid";

export function StudentsManager() {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Id<"students"> | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<Id<"classes"> | "">("");
  const [formData, setFormData] = useState({
    nome: "",
    identificador: "",
  });

  const classes = useQuery(api.classes.listClasses);
  const allStudents = useQuery(api.students.listAllStudents);
  const studentsByClass = useQuery(
    api.students.listStudents,
    selectedClassId ? { classId: selectedClassId as Id<"classes"> } : "skip"
  );
  
  // Verificar se está carregando
  const isLoading = selectedClassId 
    ? studentsByClass === undefined 
    : allStudents === undefined;
  
  // Se houver turma selecionada, usar alunos da turma, senão usar todos os alunos
  const students = selectedClassId 
    ? (studentsByClass || []) 
    : (allStudents || []);
  
  const createStudent = useMutation(api.students.createStudent);
  const updateStudent = useMutation(api.students.updateStudent);
  const deleteStudent = useMutation(api.students.deleteStudent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClassId) {
      toast.error("Selecione uma turma");
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent({
          studentId: editingStudent,
          ...formData,
        });
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await createStudent({
          classId: selectedClassId as Id<"classes">,
          ...formData,
        });
        toast.success("Aluno criado com sucesso!");
      }
      
      resetForm();
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      identificador: "",
    });
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: any) => {
    setFormData({
      nome: student.nome,
      identificador: student.identificador,
    });
    // Garantir que o classId está disponível
    const classId = student.classId || (student as any).classId;
    if (classId) {
      setSelectedClassId(classId);
    }
    setEditingStudent(student._id);
    setShowModal(true);
  };

  const handleDelete = async (studentId: Id<"students">) => {
    if (confirm("Tem certeza que deseja deletar este aluno?")) {
      try {
        await deleteStudent({ studentId });
        toast.success("Aluno deletado com sucesso!");
      } catch (error) {
        toast.error("Erro: " + (error as Error).message);
      }
    }
  };

  const selectedClass = (classes || []).find((c) => c._id === selectedClassId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Alunos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Aluno
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">Filtrar por turma:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value as Id<"classes"> | "")}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma turma</option>
          {(classes || []).map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.titulo}
            </option>
          ))}
        </select>
      </div>

      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingStudent ? "Editar Aluno" : "Novo Aluno"}
      >
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
              disabled={!!editingStudent}
            >
              <option value="">Selecione uma turma</option>
              {(classes || []).map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matricula *
            </label>
            <input
              type="text"
              value={formData.identificador}
              onChange={(e) => setFormData({ ...formData, identificador: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingStudent ? "Atualizar" : "Criar"}
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

      {isLoading ? (
        <EntityGrid>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-1">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </EntityGrid>
      ) : (
        <EntityGrid emptyMessage={selectedClassId ? "Nenhum aluno cadastrado nesta turma." : "Nenhum aluno cadastrado."}>
          {students.map((student) => {
            const studentClass = (classes || []).find((c) => c._id === student.classId);
            const subtitle = selectedClassId 
              ? `Identificador: ${student.identificador}`
              : `Identificador: ${student.identificador} - Turma: ${studentClass?.titulo || (student as any).classTitle || "N/A"}`;
            
            return (
              <EntityCard
                key={student._id}
                title={student.nome}
                subtitle={subtitle}
                onEdit={() => handleEdit(student)}
                onDelete={() => handleDelete(student._id)}
              />
            );
          })}
        </EntityGrid>
      )}
    </div>
  );
}

