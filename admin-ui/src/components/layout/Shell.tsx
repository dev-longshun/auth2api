import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r-brutal border-ink bg-cream flex flex-col">
        <div className="p-4 border-b-brutal border-ink">
          <h1 className="text-lg font-bold">auth2api</h1>
          <p className="text-xs text-ink/50">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/accounts" icon={<Users size={18} />} label="Accounts" />
        </nav>

        <div className="p-3 border-t-brutal border-ink">
          <button
            onClick={logout}
            className="nb-btn-ghost w-full text-sm"
          >
            <LogOut size={16} />
            登出
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-brutal text-sm font-medium transition-colors ${
          isActive
            ? "bg-orange text-cream border-brutal border-ink shadow-brutal-sm"
            : "text-ink hover:bg-ink/5"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
