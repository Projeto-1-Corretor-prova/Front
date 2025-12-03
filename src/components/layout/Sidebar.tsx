import { cn } from "../../lib/utils";
import { HomeIcon, UsersIcon, DocumentIcon, CheckIcon, ChartIcon, SettingsIcon, CloseIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "inicio", label: "Início", icon: <HomeIcon /> },
  { id: "turmas", label: "Turmas", icon: <UsersIcon /> },
  { id: "provas", label: "Provas", icon: <DocumentIcon /> },
  { id: "correcoes", label: "Correções", icon: <CheckIcon /> },
  { id: "relatorios", label: "Relatórios", icon: <ChartIcon /> },
  { id: "configuracoes", label: "Configurações", icon: <SettingsIcon /> },
];

export function Sidebar({ isOpen, onClose, activeRoute, onNavigate, user }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray z-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-600">
        <Logo size="sm" showText={true} className="text-white" />
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Fechar sidebar"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
              activeRoute === item.id
                ? "bg-blue text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user.name}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

