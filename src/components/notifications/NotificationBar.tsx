import { X } from "lucide-react";
import { Notification } from "./notifier";

const bgName: { [k in Notification["color"]]: string } = {
  success: "bg-lime-300",
  warning: "bg-yellow-200",
  error: "bg-red-300",
  info: "bg-blue-300",
};

const bgHoverName: { [k in Notification["color"]]: string } = {
  success: "hover:bg-lime-400",
  warning: "hover:bg-yellow-400",
  error: "hover:bg-red-400",
  info: "hover:bg-blue-400",
};

const textName: { [k in Notification["color"]]: string } = {
  success: "text-lime-800",
  warning: "text-yellow-800",
  error: "text-red-800",
  info: "text-blue-900",
};

export interface NotificationBarProps {
  notification: Notification;
  onDismiss: () => void;
}

export function NotificationBar({
  notification: { color, text },
  onDismiss,
}: NotificationBarProps) {
  return (
    <div
      className={`pl-2 flex flex-nowrap gap-2 items-center ${bgName[color]} ${textName[color]}`}
    >
      <p>{text}</p>
      <div className={`${bgHoverName[color]} rounded m-1`} onClick={onDismiss}>
        <X />
      </div>
    </div>
  );
}
