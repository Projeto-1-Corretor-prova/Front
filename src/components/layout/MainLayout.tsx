import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SignOutButton } from "../../SignOutButton";
import { MenuIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";

interface MainLayoutProps {
  children: ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  user: {
    name: string;
    email: string;
  };
}

export function MainLayout({ children, activeRoute, onNavigate, user }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-lighter">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        user={user}
      />
      
      <div className={sidebarOpen ? "ml-64 flex-1" : "flex-1"}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-light h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray hover:text-gray-600"
                aria-label="Abrir sidebar"
              >
                <MenuIcon />
              </button>
            )}
            <Logo size="md" showText={true} />
          </div>
          <SignOutButton />
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

