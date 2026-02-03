import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  filmType: z.enum(["MM35_C41", "MM35_BW", "MM120_C41", "MM120_BW", "E6_SLIDE"]),
  scanType: z.enum(["STANDARD", "HIGH_RES", "PROFESSIONAL"]),
  quantity: z.number().min(1).max(100),
  specialInstructions: z.string().optional(),
  pushPull: z.boolean().optional(),
  rushService: z.boolean().optional(),
  prints: z.boolean().optional(),
});

// Pricing logic
function calculatePrice(data: z.infer<typeof createOrderSchema>) {
  let basePrice = 0;

  // Scanning prices
  const scanPrices = {
    STANDARD: 15,
    HIGH_RES: 25,
    PROFESSIONAL: 40,
  };

  basePrice = scanPrices[data.scanType] * data.quantity;

  // Additional services
  if (data.pushPull) {
    basePrice += 5 * data.quantity;
  }

  if (data.rushService) {
    basePrice += 20;
  }

  // Prints pricing is per image, estimated at 36 exposures per roll
  if (data.prints) {
    basePrice += 0.5 * 36 * data.quantity;
  }

  return basePrice;
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `FL-${timestamp}-${random}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createOrderSchema.parse(body);

    const totalPrice = calculatePrice(data);
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (session.user as any).id,
        filmType: data.filmType,
        scanType: data.scanType,
        quantity: data.quantity,
        specialInstructions: data.specialInstructions,
        totalPrice,
        status: "RECEIVED",
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    // Create order items
    const orderItems = [];

    // Main scanning service
    orderItems.push(
      prisma.orderItem.create({
        data: {
          orderId: order.id,
          serviceType: `${data.scanType} Scanning`,
          quantity: data.quantity,
          unitPrice: data.scanType === "STANDARD" ? 15 : data.scanType === "HIGH_RES" ? 25 : 40,
          subtotal:
            (data.scanType === "STANDARD" ? 15 : data.scanType === "HIGH_RES" ? 25 : 40) *
            data.quantity,
        },
      })
    );

    // Additional services
    if (data.pushPull) {
      orderItems.push(
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            serviceType: "Push/Pull Processing",
            quantity: data.quantity,
            unitPrice: 5,
            subtotal: 5 * data.quantity,
          },
        })
      );
    }

    if (data.rushService) {
      orderItems.push(
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            serviceType: "Rush Service",
            quantity: 1,
            unitPrice: 20,
            subtotal: 20,
          },
        })
      );
    }

    if (data.prints) {
      orderItems.push(
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            serviceType: "4x6 Prints",
            quantity: 36 * data.quantity,
            unitPrice: 0.5,
            subtotal: 0.5 * 36 * data.quantity,
          },
        })
      );
    }

    await Promise.all(orderItems);

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalPrice: order.totalPrice,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    let orders;

    if (userRole === "ADMIN" || userRole === "STAFF") {
      // Admin/Staff can see all orders
      orders = await prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Customers see only their orders
      orders = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
