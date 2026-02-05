import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useOrders, useUsers } from "../../hooks/useData";
import type { Order, OrderStatus } from "../../types";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: orders, loading: loadingOrders, updateOrder } = useOrders();
  const { data: users, loading: loadingUsers } = useUsers();

  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const order = orders?.find((o) => o.id === id);
  const user = users?.find((u) => u.id === order?.userId);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const loading = loadingOrders || loadingUsers;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!order || !editedOrder) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-slate-900">
            Pedido não encontrado
          </p>
          <Button onClick={() => navigate("/orders")} className="mt-4">
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Recalcula o total baseado nos itens
    const newTotal = editedOrder.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const updatedOrder = { ...editedOrder, total: newTotal };
    updateOrder(updatedOrder);
    setEditedOrder(updatedOrder);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Detalhes do Pedido
          </h3>
          <p className="text-sm text-slate-600">Pedido #{order.id}</p>
        </div>
      </div>

      {showSuccess && (
        <Alert variant="success">
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            As alterações foram salvas com sucesso.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Preço Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(item.quantity * item.unitPrice).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total do Pedido:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      R$ {editedOrder.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Usuário Relacionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Nome:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">País:</span>
                    <span className="font-medium">{user.country}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select
                  value={editedOrder.status}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      status: e.target.value as OrderStatus,
                    })
                  }
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-slate-700">
                  Status atual:
                </span>
                <Badge variant={getStatusBadge(editedOrder.status)}>
                  {getStatusLabel(editedOrder.status)}
                </Badge>
              </div>

              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>

              <div className="rounded-lg bg-slate-50 p-3 space-y-2">
                <p className="text-xs text-slate-600">
                  <strong>Data de criação:</strong>{" "}
                  {new Date(editedOrder.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Itens:</strong> {editedOrder.items.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
