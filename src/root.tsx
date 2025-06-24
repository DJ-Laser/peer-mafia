import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Navbar } from "./components/Navbar";
import { NotificationContainer } from "./components/notifications/NotificationContainer";
import { Notifier } from "./components/notifications/notifier";
import { Spinner } from "./components/Spinner";
import { NotifierContext } from "./hooks/useNotifier";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Online Mafia Tracker</title>
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
    <div className="min-h-screen bg-slate-900 text-white">
      <NotifierContext value={pageNotifier}>
        <NotificationContainer notifier={pageNotifier} />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </NotifierContext>
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="size-full h-full mt-15 flex justify-center">
        <Spinner />
      </div>
    </div>
  );
}
