"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: string;
  filmType: string;
  scanType: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (userRole !== "ADMIN" && userRole !== "STAFF") {
        router.push("/dashboard");
        return;
      }
      fetchOrders();
    }
  }, [status, router, session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const statusOptions = [
    "RECEIVED",
    "IN_PROCESS",
    "SCANNING",
    "READY_FOR_PICKUP",
    "SHIPPED",
    "COMPLETED",
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      RECEIVED: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      IN_PROCESS: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      SCANNING: "bg-purple-500/20 text-purple-300 border-purple-500/50",
      READY_FOR_PICKUP: "bg-green-500/20 text-green-300 border-green-500/50",
      SHIPPED: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
      COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
    };
    return colors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/50";
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all orders and customers</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === "all"
                ? "bg-primary text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === status
                  ? "bg-primary text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {status.replace(/_/g, " ")} ({orders.filter((o) => o.status === status).length})
            </button>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Film Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-300">
                        <div>{order.user.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{order.filmType.replace(/_/g, " ")}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status} className="bg-gray-900">
                              {status.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
