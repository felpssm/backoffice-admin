import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UsersList } from "./components/users/UsersList";
import { UserDetail } from "./components/users/UserDetail";
import { OrdersList } from "./components/orders/OrdersList";
import { OrderDetail } from "./components/orders/OrderDetail";
import { Commissions } from "./components/commissions/Commissions";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/commissions" element={<Commissions />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
