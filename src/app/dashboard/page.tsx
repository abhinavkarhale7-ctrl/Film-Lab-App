"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {session.user?.name || session.user?.email}
            </h1>
            <p className="text-gray-400">
              {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/orders/new" className="block">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-primary mb-2">New Order</h3>
              <p className="text-gray-400">Submit a new film processing order</p>
            </div>
          </Link>

          <Link href="/orders" className="block">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-secondary transition-colors">
              <h3 className="text-xl font-semibold text-secondary mb-2">My Orders</h3>
              <p className="text-gray-400">View and track your orders</p>
            </div>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="block">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-accent transition-colors">
                <h3 className="text-xl font-semibold text-accent mb-2">Admin Panel</h3>
                <p className="text-gray-400">Manage orders and customers</p>
              </div>
            </Link>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Recent Orders</h2>
          <p className="text-gray-400">No orders yet. Create your first order to get started!</p>
        </div>
      </div>
    </div>
  );
}
