import { PropsWithChildren } from "react";
import { cardClasses } from "./cardClasses";

export interface CardProps {
  className?: string;
  secondary?: boolean;
}

export function Card({
  children,
  secondary,
  className: customClassName,
}: PropsWithChildren<CardProps>) {
  return (
    <div className={cardClasses(secondary, customClassName)}>{children}</div>
  );
}
