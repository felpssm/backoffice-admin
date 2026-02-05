import { useState, useEffect } from "react";
import axios from "axios";
import type { User, Order, Commission } from "../types/index";

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUsers(): UseDataResult<User[]> & {
  updateUser: (user: User) => void;
} {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // simular delay da api
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await axios.get<User[]>("/src/data/users.json");
      setData(response.data);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    if (data) {
      const newData = data.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      );
      setData(newData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData, updateUser };
}

export function useOrders(): UseDataResult<Order[]> & {
  updateOrder: (order: Order) => void;
} {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await axios.get<Order[]>("/src/data/orders.json");
      setData(response.data);
    } catch (err) {
      setError("Erro ao carregar pedidos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = (updatedOrder: Order) => {
    if (data) {
      const newData = data.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      );
      setData(newData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData, updateOrder };
}

export function useCommissions(): UseDataResult<Commission[]> {
  const [data, setData] = useState<Commission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await axios.get<Commission[]>(
        "/src/data/commissions.json",
      );
      setData(response.data);
    } catch (err) {
      setError("Erro ao carregar comissões");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
