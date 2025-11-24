import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function SubmissionsManager() {
  const [selectedExamId, setSelectedExamId] = useState<Id<"exams"> | "">("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    studentName: "",
    studentId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const exams = useQuery(api.exams.listExams, {}) || [];
  const submissions = useQuery(
    api.submissions.listSubmissions,
    selectedExamId ? { examId: selectedExamId as Id<"exams"> } : "skip"
  ) || [];

  const generateUploadUrl = useMutation(api.submissions.generateUploadUrl);
  const createSubmission = useMutation(api.submissions.createSubmission);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExamId) {
      toast.error("Selecione uma prova");
      return;
    }

    if (!uploadForm.studentName.trim() || !uploadForm.studentId.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      let fileId: Id<"_storage"> | undefined;

      if (selectedFile) {
        // Upload do arquivo
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!result.ok) {
          throw new Error("Erro no upload do arquivo");
        }

        const json = await result.json();
        fileId = json.storageId;
      }

      // Criar submissão
      await createSubmission({
        examId: selectedExamId as Id<"exams">,
        studentName: uploadForm.studentName.trim(),
        studentId: uploadForm.studentId.trim(),
        fileId,
      });

      toast.success("Avaliação enviada com sucesso!");
      setUploadForm({ studentName: "", studentId: "" });
      setSelectedFile(null);
      setShowUploadForm(false);
    } catch (error) {
      toast.error("Erro: " + (error as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "processing": return "Processando";
      case "completed": return "Concluído";
      case "error": return "Erro";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Avaliações</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enviar Avaliação
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">Selecionar prova:</label>
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value as Id<"exams"> | "")}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma prova</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      {showUploadForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar Avaliação</h3>
          
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Aluno *
                </label>
                <input
                  type="text"
                  value={uploadForm.studentName}
                  onChange={(e) => setUploadForm({ ...uploadForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID/Matrícula do Aluno *
                </label>
                <input
                  type="text"
                  value={uploadForm.studentId}
                  onChange={(e) => setUploadForm({ ...uploadForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arquivo CSV/Excel (opcional)
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formato esperado: colunas com "questao_1", "questao_2", etc. com as respostas do aluno
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enviar Avaliação
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedExamId && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Avaliações da Prova: {exams.find(e => e._id === selectedExamId)?.title}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID/Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Envio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.submissionDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                        {getStatusText(submission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {submission.status === "completed" && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Ver Detalhes
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma avaliação enviada para esta prova.
            </div>
          )}
        </div>
      )}

      {!selectedExamId && (
        <div className="text-center py-8 text-gray-500">
          Selecione uma prova para visualizar as avaliações.
        </div>
      )}
    </div>
  );
}
