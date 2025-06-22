import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { NotificationContainer } from "./components/notifications/NotificationContainer";
import { Notifier } from "./components/notifications/notifier";
import { NotifierContext } from "./hooks/useNotifier";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const pageNotifier = new Notifier();

export default function Root() {
  return (
    <div className="min-h-screen bg-neutral-800 text-white">
      <NotifierContext value={pageNotifier}>
        <NotificationContainer notifier={pageNotifier} />
        <Outlet />
      </NotifierContext>
    </div>
  );
}
