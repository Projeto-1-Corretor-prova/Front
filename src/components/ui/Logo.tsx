interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function Logo({ className = "", size = "md", showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/corrija-logo.png"
        alt="Corrija+"
        className={`${sizeClasses[size]} object-contain rounded-full`}
      />
      {showText && (
        <span className={`font-bold ${
          className.includes("text-white") ? "text-white" : "text-gray"
        } ${size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl"}`}>
          Corrija+
        </span>
      )}
    </div>
  );
}

