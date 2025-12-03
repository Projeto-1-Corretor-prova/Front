import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: "pendente" | "corrigida" | "em-correcao" | "concluida";
  children?: string;
}

const statusConfig = {
  pendente: {
    label: "Pendente",
    className: "bg-red-500 text-white",
  },
  corrigida: {
    label: "Corrigida",
    className: "bg-green-500 text-white",
  },
  "em-correcao": {
    label: "Em correção",
    className: "bg-yellow-500 text-white",
  },
  concluida: {
    label: "Concluída",
    className: "bg-green-500 text-white",
  },
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn("px-3 py-1 rounded text-sm font-medium", config.className)}>
      {children || config.label}
    </span>
  );
}

