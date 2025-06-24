import { RouterIcon, UserIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { NavLink } from "react-router";

interface PageLinkProps {
  to: string;
  activeClassName: string;
}

function PageLink({
  to,
  activeClassName,

  children,
}: PropsWithChildren<PageLinkProps>) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? activeClassName
            : "text-slate-300 hover:text-white hover:bg-slate-700"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Online Mafia</h1>
          </NavLink>

          <div className="flex space-x-1">
            <PageLink to="/play" activeClassName="bg-sky-600">
              <UserIcon className="w-4 h-4" />
              <span>Player</span>
            </PageLink>
            <PageLink to="/host" activeClassName="bg-orange-500">
              <RouterIcon className="w-4 h-4" />
              <span>Host</span>
            </PageLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
