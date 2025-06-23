import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  className?: string;
}

export function Card({
  children,
  className: customClassName,
}: PropsWithChildren<CardProps>) {
  const className = twMerge(
    "bg-slate-800 rounded-2xl p-8 border border-slate-700",
    customClassName,
  );

  return <div className={className}>{children}</div>;
}
