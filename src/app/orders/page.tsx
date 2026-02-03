"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  filmType: string;
  scanType: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  estimatedCompletion: string | null;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

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

  const formatFilmType = (type: string) => {
    const types: Record<string, string> = {
      MM35_C41: "35mm C-41",
      MM35_BW: "35mm B&W",
      MM120_C41: "120 C-41",
      MM120_BW: "120 B&W",
      E6_SLIDE: "E-6 Slide",
    };
    return types[type] || type;
  };

  const formatScanType = (type: string) => {
    const types: Record<string, string> = {
      STANDARD: "Standard",
      HIGH_RES: "High-Res",
      PROFESSIONAL: "Professional",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-gray-400">Track your film processing orders</p>
          </div>
          <Link
            href="/orders/new"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors"
          >
            New Order
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
            <p className="text-gray-400 mb-4">No orders yet</p>
            <Link
              href="/orders/new"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors"
            >
              Create Your First Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                      <span>Film: {formatFilmType(order.filmType)}</span>
                      <span>Scan: {formatScanType(order.scanType)}</span>
                      <span>Total: ${order.totalPrice.toFixed(2)}</span>
                      <span>
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      {order.estimatedCompletion && (
                        <span>
                          Est. Completion: {new Date(order.estimatedCompletion).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
