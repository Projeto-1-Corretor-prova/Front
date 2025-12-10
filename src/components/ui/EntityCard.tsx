import { ReactNode } from "react";
import { cn } from "../../lib/utils";

// Ícones simples inline
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" fill="currentColor"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fill="currentColor"/>
    </svg>
  );
}

interface EntityCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function EntityCard({
  title,
  subtitle,
  description,
  onEdit,
  onDelete,
  actions,
  children,
  className,
}: EntityCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
              title="Editar"
            >
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              title="Deletar"
            >
              <TrashIcon />
            </button>
          )}
          {actions}
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
      
      {children && (
        <div className="mt-3">{children}</div>
      )}
    </div>
  );
}

