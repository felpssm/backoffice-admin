import {
  Users,
  UserCheck,
  ShoppingCart,
  DollarSign,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useUsers, useOrders, useCommissions } from "../../hooks/useData";
import type { DashboardStats } from "../../types";

export function Dashboard() {
  const { data: users, loading: loadingUsers } = useUsers();
  const { data: orders, loading: loadingOrders } = useOrders();
  const { data: commissions, loading: loadingCommissions } = useCommissions();

  const loading = loadingUsers || loadingOrders || loadingCommissions;

  const stats: DashboardStats = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter((u) => u.status === "active").length || 0,
    totalOrders: orders?.length || 0,
    totalOrdersValue: orders?.reduce((sum, order) => sum + order.total, 0) || 0,
    totalCommissions:
      commissions?.reduce((sum, comm) => sum + comm.amount, 0) || 0,
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total de Pedidos",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Valor Total Pedidos",
      value: `R$ ${stats.totalOrdersValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total de Comissões",
      value: `R$ ${stats.totalCommissions.toFixed(2)}`,
      icon: Wallet,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Visão Geral</h3>
        <p className="text-sm text-slate-600">
          Dashboard administrativo do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
