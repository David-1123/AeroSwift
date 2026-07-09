import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { DriversManager, type Driver } from "@/components/DriversManager";

export const metadata = { title: "Conductores · AeroSwift" };
export const dynamic = "force-dynamic";

export default async function ConductoresPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const driversRaw = await prisma.driver.findMany({
    where: { active: true },
    orderBy: { fullName: "asc" },
  });

  const drivers: Driver[] = driversRaw.map((d) => ({
    id: d.id,
    fullName: d.fullName,
    phone: d.phone,
    vehicle: d.vehicle,
    plate: d.plate,
  }));

  return (
    <AdminShell adminName={admin.fullName}>
      <DriversManager drivers={drivers} />
    </AdminShell>
  );
}
