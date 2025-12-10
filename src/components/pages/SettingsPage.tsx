import { ProfessorsManager } from "../ProfessorsManager";
import { QuestionBanksManager } from "../QuestionBanksManager";
import { StudentsManager } from "../StudentsManager";
import { useState } from "react";

type SettingsTab = "profile" | "questionBanks" | "students";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie e visualize suas configurações</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Perfil
            </button>
            <button
              onClick={() => setActiveTab("questionBanks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "questionBanks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bancos de Questões
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Alunos
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && <ProfessorsManager />}
          {activeTab === "questionBanks" && <QuestionBanksManager />}
          {activeTab === "students" && <StudentsManager />}
        </div>
      </div>
    </div>
  );
}

