import { PropsWithChildren, useEffect, useRef } from "react";
import { cardClasses } from "./cardClasses";

export interface DialogProps {
  open: boolean;
  className?: string;
  centerX?: boolean;
  centerY?: boolean;
  onClose?: () => void;
}

export function Dialog({
  open,
  className: customClassName,
  centerX = true,
  centerY = false,
  onClose,
  children,
}: PropsWithChildren<DialogProps>) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const centerXClasses = centerX ? "left-1/2 -translate-x-1/2" : undefined;
  const centerYClasses = centerY ? "top-1/2 -translate-y-1/2" : undefined;

  return (
    <dialog
      className={cardClasses(
        false,
        "fixed",
        centerXClasses,
        centerYClasses,
        customClassName,
      )}
      ref={dialogRef}
      onClose={onClose}
    >
      {children}
    </dialog>
  );
}
