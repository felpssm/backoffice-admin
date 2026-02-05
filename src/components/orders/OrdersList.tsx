import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ArrowUpDown } from "lucide-react";
import { Select } from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useOrders, useUsers } from "../../hooks/useData";
import type { OrderStatus } from "../../types";

type SortField = "date" | "value";
type SortDirection = "asc" | "desc";

export function OrdersList() {
  const navigate = useNavigate();
  const { data: orders, loading: loadingOrders } = useOrders();
  const { data: users, loading: loadingUsers } = useUsers();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const loading = loadingOrders || loadingUsers;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-slate-900">
            Nenhum pedido encontrado
          </p>
          <p className="text-sm text-slate-600">
            Não há pedidos cadastrados no sistema
          </p>
        </div>
      </div>
    );
  }

  const getUserName = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    return user?.name || "Usuário não encontrado";
  };

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;

    if (sortField === "date") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      comparison = a.total - b.total;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      pending: "warning",
      processing: "default",
      completed: "success",
      cancelled: "destructive",
    } as const;
    return variants[status];
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: "Pendente",
      processing: "Processando",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return labels[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Pedidos</h3>
          <p className="text-sm text-slate-600">Gerenciar pedidos do sistema</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OrderStatus | "all")
          }
        >
          <option value="all">Todos Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Processando</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={sortField === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSort("date")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Data {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortField === "value" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSort("value")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Valor{" "}
            {sortField === "value" && (sortDirection === "asc" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Tabela */}
      {sortedOrders.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <Filter className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-900">
              Nenhum resultado encontrado
            </p>
            <p className="text-sm text-slate-600">Tente ajustar os filtros</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="text-slate-600">
                    {getUserName(order.userId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
