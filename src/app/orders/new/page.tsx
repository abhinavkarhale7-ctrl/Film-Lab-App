"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const orderSchema = z.object({
  filmType: z.enum(["MM35_C41", "MM35_BW", "MM120_C41", "MM120_BW", "E6_SLIDE"]),
  scanType: z.enum(["STANDARD", "HIGH_RES", "PROFESSIONAL"]),
  quantity: z.number().min(1).max(100),
  specialInstructions: z.string().optional(),
  pushPull: z.boolean().optional(),
  rushService: z.boolean().optional(),
  prints: z.boolean().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function NewOrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      pushPull: false,
      rushService: false,
      prints: false,
    },
  });

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const result = await response.json();
      router.push(`/orders/${result.order.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const filmTypes = [
    { value: "MM35_C41", label: "35mm Color (C-41)" },
    { value: "MM35_BW", label: "35mm Black & White" },
    { value: "MM120_C41", label: "120 Color (C-41)" },
    { value: "MM120_BW", label: "120 Black & White" },
    { value: "E6_SLIDE", label: "E-6 Slide Film" },
  ];

  const scanTypes = [
    { value: "STANDARD", label: "Standard - $15", description: "2000x3000 pixels" },
    { value: "HIGH_RES", label: "High Resolution - $25", description: "3000x4500 pixels" },
    { value: "PROFESSIONAL", label: "Professional - $40", description: "4000x6000 pixels" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">New Order</h1>
          <p className="text-gray-400">Submit a new film processing order</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Film Type *
              </label>
              <div className="space-y-2">
                {filmTypes.map((type) => (
                  <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value={type.value}
                      {...register("filmType")}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700"
                    />
                    <span className="text-white">{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.filmType && (
                <p className="mt-1 text-sm text-red-400">{errors.filmType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Scanning Options *
              </label>
              <div className="space-y-3">
                {scanTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register("scanType")}
                      className="w-4 h-4 mt-1 text-primary focus:ring-primary border-gray-600 bg-gray-700"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{type.label}</div>
                      <div className="text-sm text-gray-400">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.scanType && (
                <p className="mt-1 text-sm text-red-400">{errors.scanType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                Number of Rolls *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="100"
                {...register("quantity", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Additional Services</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("pushPull")}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700 rounded"
              />
              <div>
                <span className="text-white">Push/Pull Processing (+$5 per roll)</span>
                <p className="text-sm text-gray-400">Adjust development time</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("rushService")}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700 rounded"
              />
              <div>
                <span className="text-white">Rush Service (+$20)</span>
                <p className="text-sm text-gray-400">24-hour turnaround</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("prints")}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700 rounded"
              />
              <div>
                <span className="text-white">4x6 Prints (+$0.50 per image)</span>
                <p className="text-sm text-gray-400">Physical prints of your scans</p>
              </div>
            </label>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-300 mb-2">
              Special Instructions
            </label>
            <textarea
              id="specialInstructions"
              rows={4}
              {...register("specialInstructions")}
              placeholder="Any special requests or notes for processing..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
