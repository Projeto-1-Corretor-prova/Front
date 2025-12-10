import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ClassesManager } from "./ClassesManager";
import { ExamsManager } from "./ExamsManager";
import { SubmissionsManager } from "./SubmissionsManager";

type Tab = "classes" | "exams" | "submissions";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  const professorProfile = useQuery(api.professors.getCurrentProfile);

  if (!professorProfile) {
    return null;
  }

  const tabs = [
    { id: "classes" as Tab, label: "Turmas", icon: "👥" },
    { id: "exams" as Tab, label: "Provas", icon: "📝" },
    { id: "submissions" as Tab, label: "Avaliações", icon: "📊" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, {professorProfile.nome}!
        </h1>
        <p className="text-gray-600">
          {professorProfile.institution && `${professorProfile.institution} • `}
          {professorProfile.department}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "classes" && <ClassesManager />}
          {activeTab === "exams" && <ExamsManager />}
          {activeTab === "submissions" && <SubmissionsManager />}
        </div>
      </div>
    </div>
  );
}
