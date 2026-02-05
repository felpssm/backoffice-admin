import { useState } from "react";
import { DollarSign, Filter } from "lucide-react";
import { Select } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCommissions, useUsers, useOrders } from "../../hooks/useData";
import type { CommissionStatus } from "../../types";

export function Commissions() {
  const { data: commissions, loading: loadingCommissions } = useCommissions();
  const { data: users, loading: loadingUsers } = useUsers();
  const { data: orders, loading: loadingOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | "all">(
    "all",
  );

  const loading = loadingCommissions || loadingUsers || loadingOrders;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!commissions || commissions.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-slate-900">
            Nenhuma comissão encontrada
          </p>
          <p className="text-sm text-slate-600">
            Não há comissões cadastradas no sistema
          </p>
        </div>
      </div>
    );
  }

  const getUserName = (userId: string) => {
    const user = users?.find((u) => u.id === userId);
    return user?.name || "Usuário não encontrado";
  };

  const getOrderId = (orderId: string) => {
    return orderId;
  };

  const filteredCommissions = commissions.filter((commission) => {
    return statusFilter === "all" || commission.status === statusFilter;
  });

  const totalPending = filteredCommissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaid = filteredCommissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalAll = filteredCommissions.reduce((sum, c) => sum + c.amount, 0);

  const getStatusBadge = (status: CommissionStatus) => {
    return status === "paid" ? "success" : "warning";
  };

  const getStatusLabel = (status: CommissionStatus) => {
    return status === "paid" ? "Paga" : "Pendente";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Comissões</h3>
          <p className="text-sm text-slate-600">
            Gerenciar comissões dos vendedores
          </p>
        </div>
      </div>

      {/* Cards de totalizadores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Geral
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              R$ {totalAll.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600">Todas as comissões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Pendente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              R$ {totalPending.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600">Aguardando pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Pagas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              R$ {totalPaid.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600">Já processadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as CommissionStatus | "all")
          }
        >
          <option value="all">Todos Status</option>
          <option value="pending">Pendente</option>
          <option value="paid">Paga</option>
        </Select>
      </div>

      {/* Tabela */}
      {filteredCommissions.length === 0 ? (
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
                <TableHead>Usuário</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {getUserName(commission.userId)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {getOrderId(commission.orderId)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(commission.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(commission.status)}>
                      {getStatusLabel(commission.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {commission.amount.toFixed(2)}
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
