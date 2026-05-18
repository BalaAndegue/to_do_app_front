import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom";
}

export default function Tooltip({ label, children, position = "top" }: TooltipProps) {
  return (
    <div className="tooltip-wrap">
      {children}
      <span
        className="tooltip-bubble"
        style={
          position === "bottom"
            ? { bottom: "auto", top: "calc(100% + 8px)" }
            : undefined
        }
      >
        {label}
      </span>
    </div>
  );
}
