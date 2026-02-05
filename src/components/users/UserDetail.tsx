import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useUsers } from "../../hooks/useData";
import type { User } from "../../types";

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: users, loading, updateUser } = useUsers();

  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const user = users?.find((u) => u.id === id);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!user || !editedUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-slate-900">
            Usuário não encontrado
          </p>
          <Button onClick={() => navigate("/users")} className="mt-4">
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(editedUser);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleStatus = () => {
    setEditedUser({
      ...editedUser,
      status: editedUser.status === "active" ? "inactive" : "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Detalhes do Usuário
          </h3>
          <p className="text-sm text-slate-600">
            Visualizar e editar informações
          </p>
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome
                </label>
                <Input
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tipo
                  </label>
                  <Input
                    value={editedUser.role}
                    disabled
                    className="capitalize"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    País
                  </label>
                  <Input value={editedUser.country} disabled />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setEditedUser(user)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Status atual:
                </span>
                <Badge
                  variant={
                    editedUser.status === "active" ? "success" : "outline"
                  }
                >
                  {editedUser.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <Button
                variant={
                  editedUser.status === "active" ? "destructive" : "default"
                }
                className="w-full"
                onClick={toggleStatus}
              >
                {editedUser.status === "active"
                  ? "Desativar Usuário"
                  : "Ativar Usuário"}
              </Button>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-600">
                  <strong>ID:</strong> {editedUser.id}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Criado em:</strong>{" "}
                  {new Date(editedUser.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
