import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Route } from "./+types/root";
import { Connection } from "./components/connection/connection";
import { ConnectionContext } from "./components/connection/ConnectionContext";
import { NotificationContainer } from "./components/notifications/NotificationContainer";
import { Notifier } from "./components/notifications/notifier";

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

// eslint-disable-next-line react-refresh/only-export-components
export function clientLoader() {
  const notifier = new Notifier();
  const connection = new Connection(notifier);
  return { notifier, connection };
}

export default function Root({ loaderData }: Route.ComponentProps) {
  return (
    <ConnectionContext value={loaderData.connection}>
      <div className="min-h-screen bg-neutral-800 text-white">
        <NotificationContainer notifier={loaderData.notifier} />
        <Outlet />
      </div>
    </ConnectionContext>
  );
}
