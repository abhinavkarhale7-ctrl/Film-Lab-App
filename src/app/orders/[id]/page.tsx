"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  serviceType: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  filmType: string;
  scanType: string;
  status: string;
  totalPrice: number;
  quantity: number;
  specialInstructions: string | null;
  estimatedCompletion: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && params.id) {
      fetchOrder();
    }
  }, [status, params.id, router]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      const data = await response.json();
      setOrder(data.order);
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

  if (error || !order) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-300">
            {error || "Order not found"}
          </div>
          <Link href="/orders" className="inline-block mt-4 text-primary hover:underline">
            ← Back to Orders
          </Link>
        </div>
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
      MM35_C41: "35mm Color (C-41)",
      MM35_BW: "35mm Black & White",
      MM120_C41: "120 Color (C-41)",
      MM120_BW: "120 Black & White",
      E6_SLIDE: "E-6 Slide Film",
    };
    return types[type] || type;
  };

  const formatScanType = (type: string) => {
    const types: Record<string, string> = {
      STANDARD: "Standard Scan",
      HIGH_RES: "High-Resolution Scan",
      PROFESSIONAL: "Professional Scan",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/orders" className="inline-block mb-6 text-primary hover:underline">
          ← Back to Orders
        </Link>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{order.orderNumber}</h1>
              <p className="text-gray-400">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Film Details</h3>
              <div className="space-y-1 text-white">
                <p>Type: {formatFilmType(order.filmType)}</p>
                <p>Quantity: {order.quantity} roll{order.quantity > 1 ? "s" : ""}</p>
                <p>Scan Type: {formatScanType(order.scanType)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Timeline</h3>
              <div className="space-y-1 text-white">
                <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.estimatedCompletion && (
                  <p>
                    Estimated Completion:{" "}
                    {new Date(order.estimatedCompletion).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Special Instructions</h3>
              <p className="text-white bg-white/5 p-4 rounded-lg">{order.specialInstructions}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Order Items</h3>
            <div className="bg-white/5 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Service
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-white">{item.serviceType}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/5">
                    <td colSpan={3} className="px-4 py-3 text-right text-white font-semibold">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-primary font-bold text-lg">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {order.status === "COMPLETED" || order.status === "READY_FOR_PICKUP" ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-green-300 mb-2">
              Your scans are ready!
            </h3>
            <p className="text-gray-300 mb-4">
              Download your digital scans or arrange for pickup.
            </p>
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
              Download Scans
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Order In Progress</h3>
            <p className="text-gray-400">
              We'll notify you when your order is ready for pickup or download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
