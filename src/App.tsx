import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { MainLayout } from "./components/layout/MainLayout";
import { HomePage } from "./components/pages/HomePage";
import { ClassesPage } from "./components/pages/ClassesPage";
import { ExamsPage } from "./components/pages/ExamsPage";
import { CorrectionsPage } from "./components/pages/CorrectionsPage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { ProfileSetup } from "./components/ProfileSetup";

type Route = "inicio" | "turmas" | "provas" | "correcoes" | "relatorios" | "configuracoes";

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
      <Toaster />
    </div>
  );
}

function LoginRoute() {
  return <LoginPage />;
}

function MainRoutes() {
  return (
    <>
      <Authenticated>
        <AppContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedView />
      </Unauthenticated>
    </>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState<Route>("inicio");
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const professorProfile = useQuery(api.professors.getCurrentProfile);

  if (loggedInUser === undefined || professorProfile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (!professorProfile) {
    return <ProfileSetup />;
  }

  const user = {
    name: professorProfile.name || "Professor",
    email: loggedInUser.email || "professor@escola.com",
  };

  const renderPage = () => {
    switch (activeRoute) {
      case "inicio":
        return <HomePage />;
      case "turmas":
        return <ClassesPage />;
      case "provas":
        return <ExamsPage />;
      case "correcoes":
        return <CorrectionsPage />;
      case "relatorios":
        return <ReportsPage />;
      case "configuracoes":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <MainLayout activeRoute={activeRoute} onNavigate={setActiveRoute} user={user}>
      {renderPage()}
    </MainLayout>
  );
}

function UnauthenticatedView() {
  const navigate = useNavigate();
  return <LandingPage onShowLogin={() => navigate("/login")} />;
}
