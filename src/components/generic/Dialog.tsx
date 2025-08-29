import { PropsWithChildren, RefObject } from "react";
import { cardClasses } from "./cardClasses";

export interface DialogProps {
  className?: string;
  centered?: boolean;
  onClose?: () => void;
  ref: RefObject<HTMLDialogElement | null>;
}

export function Dialog({
  className: customClassName,
  centered = true,
  onClose,
  ref,
  children,
}: PropsWithChildren<DialogProps>) {
  const centeredClasses = centered ? "left-1/2 -translate-x-1/2" : undefined;

  return (
    <dialog
      className={cardClasses(false, "fixed", centeredClasses, customClassName)}
      ref={ref}
      onClose={onClose}
    >
      {children}
    </dialog>
  );
}
