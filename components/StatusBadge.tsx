import type { RideStatus } from "@/generated/prisma/enums";
import { STATUS_LABELS, STATUS_BADGE } from "@/lib/rides";

export function StatusBadge({ status }: { status: RideStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
