import { PropsWithChildren } from "react";
import { cardClasses } from "./cardClasses";

export interface AccordianProps {
  className?: string;
  secondary?: boolean;
}

export function Accordian({
  children,
  secondary,
  className: customClassName,
}: PropsWithChildren<AccordianProps>) {
  return (
    <details className={cardClasses(secondary, customClassName)}>
      {children}
    </details>
  );
}
