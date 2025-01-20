import { useEffect, useState } from "react";
import { NotificationBar } from "./NotificationBar";
import { Notification, Notifier } from "./notifier";

export interface NotificationContainerProps {
  notifier: Notifier;
}

export function NotificationContainer({
  notifier,
}: NotificationContainerProps) {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined,
  );

  useEffect(() => {
    const callback = (notification?: Notification) =>
      setNotification(notification);

    notifier.addListener(callback);

    return () => {
      notifier.removeListener(callback);
    };
  }, [notifier]);

  return (
    <>
      {notification ? (
        <div className="absolute top-0">
          <NotificationBar
            notification={notification}
            onDismiss={() => notifier.dismiss()}
          />
        </div>
      ) : null}
    </>
  );
}
