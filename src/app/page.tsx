import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Eternus Film Lab
          </h1>
          <p className="text-2xl text-gray-300">
            Professional Film Processing & Scanning
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Modern web application for managing film processing orders, customer communications, and business operations.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-black font-semibold transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg bg-secondary hover:bg-secondary-dark text-white font-semibold transition-colors"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-lg border border-accent hover:bg-accent/10 text-accent font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold text-primary mb-2">Order Management</h3>
            <p className="text-gray-400">
              Submit and track your film processing orders with real-time status updates.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold text-secondary mb-2">Professional Scanning</h3>
            <p className="text-gray-400">
              Choose from Standard, High-Res, or Professional scanning options.
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold text-accent mb-2">Secure Delivery</h3>
            <p className="text-gray-400">
              Download your digital scans securely through our customer portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
