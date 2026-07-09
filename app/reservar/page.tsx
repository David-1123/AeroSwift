import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata = {
  title: "Reservar traslado · AeroSwift",
};

export default function ReservarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            Cotizador
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-onyx">
            Cotiza y reserva tu traslado.
          </h1>
        </div>
        <BookingFlow />
      </main>
      <SiteFooter />
    </div>
  );
}
