import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingCart, DollarSign } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/users", label: "Usuários", icon: Users },
    { path: "/orders", label: "Pedidos", icon: ShoppingCart },
    { path: "/commissions", label: "Comissões", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white shadow-sm">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-slate-900">Backoffice Admin</h1>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h2>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
