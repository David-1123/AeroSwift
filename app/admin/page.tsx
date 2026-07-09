import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { AdminBoard, type RideRow, type DriverOption } from "@/components/AdminBoard";
import { SECTOR_LABELS, DIRECTION_LABELS, PAYMENT_LABELS } from "@/lib/rides";

export const metadata = { title: "Viajes · AeroSwift" };
export const dynamic = "force-dynamic";

const TZ = "America/Guayaquil";

function ecuadorTodayRange(): { start: Date; end: Date } {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const start = new Date(`${today}T00:00:00-05:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function dateParts(d: Date) {
  return {
    dayKey: d.toLocaleDateString("en-CA", { timeZone: TZ }), // YYYY-MM-DD
    dayLabel: d.toLocaleDateString("es-EC", {
      timeZone: TZ,
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    timeLabel: d.toLocaleTimeString("es-EC", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { start, end } = ecuadorTodayRange();

  const [ridesRaw, driversRaw, ridesToday, pending, earningsAgg] = await Promise.all([
    prisma.ride.findMany({ orderBy: { scheduledAt: "asc" }, include: { driver: true } }),
    prisma.driver.findMany({ where: { active: true }, orderBy: { fullName: "asc" } }),
    prisma.ride.count({ where: { scheduledAt: { gte: start, lt: end }, status: { not: "CANCELADO" } } }),
    prisma.ride.count({ where: { status: "PENDIENTE" } }),
    prisma.ride.aggregate({
      _sum: { price: true },
      where: { status: "COMPLETADO", scheduledAt: { gte: start, lt: end } },
    }),
  ]);

  const rides: RideRow[] = ridesRaw.map((r) => {
    const p = dateParts(r.scheduledAt);
    return {
      id: r.id,
      code: r.id.slice(-6).toUpperCase(),
      clientName: r.clientName,
      clientPhone: r.clientPhone,
      scheduledAtISO: r.scheduledAt.toISOString(),
      dayKey: p.dayKey,
      dayLabel: p.dayLabel,
      timeLabel: p.timeLabel,
      route: `${DIRECTION_LABELS[r.direction]} · ${SECTOR_LABELS[r.sector]}`,
      flightNumber: r.flightNumber ?? "—",
      numPassengers: r.numPassengers,
      numBags: r.numBags,
      price: r.price,
      status: r.status,
      payment: r.paymentMethod ? PAYMENT_LABELS[r.paymentMethod] : "—",
      driverId: r.driverId,
      driverName: r.driver?.fullName ?? null,
    };
  });

  const drivers: DriverOption[] = driversRaw.map((d) => ({ id: d.id, fullName: d.fullName }));

  return (
    <AdminShell adminName={admin.fullName}>
      <AdminBoard
        initialRides={rides}
        drivers={drivers}
        stats={{ ridesToday, pending, earningsToday: earningsAgg._sum.price ?? 0 }}
      />
    </AdminShell>
  );
}
