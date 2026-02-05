export type UserRole = "admin" | "seller" | "customer";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  status: UserStatus;
  createdAt: string;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export type CommissionStatus = "pending" | "paid";

export interface Commission {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: CommissionStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalOrdersValue: number;
  totalCommissions: number;
}
