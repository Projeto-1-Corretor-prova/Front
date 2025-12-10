import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface EntityGridProps {
  children: ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function EntityGrid({ children, emptyMessage, className }: EntityGridProps) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {isEmpty ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          {emptyMessage || "Nenhum item encontrado."}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

