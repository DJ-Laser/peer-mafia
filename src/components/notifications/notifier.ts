export interface Notification {
  color: "success" | "warning" | "error" | "info";
  text: string;
}

export class Notifier {
  private currentNotification?: Notification;
  private listeners: ((n?: Notification) => void)[] = [];

  public get notification() {
    return this.currentNotification;
  }

  private updateListeners() {
    for (const callback of this.listeners) {
      callback(this.notification);
    }
  }

  public dismiss() {
    this.currentNotification = undefined;
    this.updateListeners();
  }

  public setNotification(notification: Notification) {
    this.currentNotification = notification;
    this.updateListeners();
  }

  public addListener(callback: (n?: Notification) => void) {
    this.listeners.push(callback);
  }

  public removeListener(callback: (n?: Notification) => void) {
    this.listeners.splice(this.listeners.indexOf(callback), 1);
  }
}

const notifier = new Notifier();
export function getNotifier(): Notifier {
  return notifier;
}
