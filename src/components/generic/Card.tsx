import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  className?: string;
  secondary?: boolean;
}

export function Card({
  children,
  secondary,
  className: customClassName,
}: PropsWithChildren<CardProps>) {
  const colors = secondary
    ? "rounded-lg bg-slate-700/50 border-slate-600"
    : "rounded-2xl bg-slate-800 border-slate-700";

  const className = twMerge(colors, "p-8 border", customClassName);

  return <div className={className}>{children}</div>;
}
